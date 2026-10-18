/**
 * The Custom Elements Manifest of the package (`custom-elements.json`, https://github.com/webcomponents/custom-elements-manifest):
 * the standard description of custom elements read by IDEs, Storybook and documentation generators. Written by
 * `@custom-elements-manifest/analyzer` (`pnpm build` runs `cem analyze`), with a plugin for the way the elements are
 * declared here, which the analyzer does not know:
 *
 * - `Base.withAttributes({ … })`: the superclass is `Base`, the keys are the attributes (with their JSDoc and
 *   `@default`) and their camel-cased properties; `property<Type>()` entries are properties only;
 * - `this.emit('type', detail satisfies Detail, eventDetails?)`: an event (`CustomEvent<Detail>`, cancelable with
 *   `eventDetails`), described by the `Events:` line of the class comment, which also lists events dispatched otherwise;
 * - only the parts registered by `define` (the `elements` of `src/components/<name>/index.ts`) are custom elements.
 *   Their tag names depend on the prefix given to `define`, so the manifest has none: `<prefix>-<name>` for `root`,
 *   `<prefix>-<name>-<part>` for the others.
 *
 * - the CSS variables of an element (`cssProperties`) are those of its core enum (`<Family><Part>CssVars`), read from
 *   the declarations of core-components.
 *
 * The class comments keep their summary; their `Attributes:` / `Events:` lines are replaced by the structured fields.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

const SECTION = /\n\s*(?:Attributes|Properties|Events|State attributes|CSS variables|Slots):/;
const EVENTS_LINE = /\n\s*Events:([\s\S]*?)(?=\n\s*(?:Attributes|Properties|State attributes|CSS variables|Slots):|$)/;
const LISTED_EVENT = /`([\w-]+)`(?:\s*\(((?:[^()]|\([^()]*\))*)\))?/g;
const COMPONENT_ENTRY = /^src\/components\/([\w-]+)\/index\.ts$/;
const CSS_VARS = /CssVars$/;
const KEBAB_LETTER = /-(\w)/g;
const SPACES = /\s+/g;

const AS_CHILD = {
    name: 'as-child',
    type: { text: 'boolean' },
    description:
        'Applies the attributes, state and behaviour of the element to its only child element instead of itself (a native `<button>`, a link…).'
};

const camelCase = (name) => name.replace(KEBAB_LETTER, (_, letter) => letter.toUpperCase());
const FIRST_LETTER = /^\w/;
const pascalCase = (name) => camelCase(name).replace(FIRST_LETTER, (letter) => letter.toUpperCase());

/** The text and tags of the JSDoc comment of a node. */
function jsDocOf(ts, node) {
    const doc = ts.getJSDocCommentsAndTags(node).find((item) => ts.isJSDoc(item));
    const tags = Object.fromEntries((doc?.tags ?? []).map((tag) => [tag.tagName.text, ts.getTextOfJSDocComment(tag.comment)?.trim()]));
    return { description: ts.getTextOfJSDocComment(doc?.comment)?.trim() || undefined, tags };
}

/** The type of an attribute spec: `'boolean'`, `'string'`, `'number'`, a list of values, or `property<Type>()`. */
function specOf(ts, initializer) {
    if (ts.isStringLiteral(initializer)) {
        return { type: initializer.text, attribute: true };
    }
    if (ts.isArrayLiteralExpression(initializer)) {
        return { type: initializer.elements.map((element) => `'${element.text}'`).join(' | '), attribute: true };
    }
    return { type: initializer.typeArguments?.[0]?.getText() ?? 'unknown', attribute: false };
}

/** The module path (`src/…/File.ts`) of a class imported by the module `from` (relative imports only). */
function resolveImport(sourceFile, name, from) {
    const statement = sourceFile.statements.find(
        (item) =>
            item.moduleSpecifier?.text.startsWith('.') &&
            item.importClause?.namedBindings?.elements?.some((binding) => binding.name.text === name)
    );
    if (!statement) {
        return from;
    }
    const parts = from.split('/').slice(0, -1);
    for (const segment of statement.moduleSpecifier.text.split('/')) {
        if (segment === '..') {
            parts.pop();
        } else if (segment !== '.') {
            parts.push(segment);
        }
    }
    return `${parts.join('/')}.ts`;
}

/** The `withAttributes({ … })` call a class extends, if any. */
function withAttributesCall(ts, node) {
    const heritage = node.heritageClauses?.find((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword)?.types[0]?.expression;
    const isCall = heritage && ts.isCallExpression(heritage) && ts.isPropertyAccessExpression(heritage.expression);
    return isCall && heritage.expression.name.text === 'withAttributes' ? heritage : undefined;
}

/** The attributes and properties declared by a `withAttributes({ … })` literal. */
function readAttributes(ts, literal) {
    const attributes = [];
    const fields = [];
    for (const property of literal?.properties ?? []) {
        const name = property.name.text ?? property.name.getText();
        const { description, tags } = jsDocOf(ts, property);
        const { type, attribute } = specOf(ts, property.initializer);
        const fieldName = attribute ? camelCase(name) : name;
        const documented = {
            ...(description && { description }),
            ...(tags.default && tags.default !== 'undefined' && { default: tags.default })
        };
        if (attribute) {
            attributes.push({ name, type: { text: type }, ...documented, fieldName });
        }
        fields.push({
            kind: 'field',
            name: fieldName,
            type: { text: `${type} | undefined` },
            ...documented,
            ...(attribute && { attribute: name })
        });
    }
    return { attributes, fields };
}

/** The events of the `Events:` line of a class comment: `` `checked-change` (cancelable; `detail: …`) ``. */
function listedEvents(description) {
    const line = description?.match(EVENTS_LINE)?.[1] ?? '';
    return new Map([...line.matchAll(LISTED_EVENT)].map(([, name, details]) => [name, details?.replace(SPACES, ' ').trim()]));
}

/** The events of a class: its `this.emit(…)` calls, then the other events listed by its comment. */
function readEvents(ts, node, description) {
    const listed = listedEvents(description);
    const events = new Map();
    node.forEachChild(function visit(child) {
        if (ts.isCallExpression(child) && child.expression.getText() === 'this.emit' && ts.isStringLiteral(child.arguments[0])) {
            const [type, detail] = child.arguments;
            const detailType = detail && ts.isSatisfiesExpression(detail) ? detail.type.getText() : undefined;
            const summary = listed.get(type.text) ?? (child.arguments.length > 2 ? 'cancelable' : undefined);
            events.set(type.text, {
                name: type.text,
                type: { text: detailType ? `CustomEvent<${detailType}>` : 'CustomEvent' },
                ...(summary && { description: summary })
            });
        }
        child.forEachChild(visit);
    });
    for (const [name, summary] of listed) {
        if (!events.has(name)) {
            events.set(name, { name, type: { text: 'CustomEvent' }, ...(summary && { description: summary }) });
        }
    }
    return [...events.values()];
}

/**
 * Records the classes registered by a component entry (`src/components/<family>/index.ts`): `export const elements = {
 * root: XElement, … }`, or one element. A class can be a part of several components (the dialog's trigger in the drawer).
 */
function collectRegistered(ts, node, family, registered) {
    if (!(ts.isVariableDeclaration(node) && node.name.getText() === 'elements' && node.initializer)) {
        return;
    }
    const literal = ts.isAsExpression(node.initializer) ? node.initializer.expression : node.initializer;
    const parts = ts.isIdentifier(literal)
        ? [['root', literal.text]]
        : (literal.properties ?? []).map((property) => [property.name.getText(), property.initializer.getText()]);
    for (const [part, name] of parts) {
        registered.set(name, [...(registered.get(name) ?? []), { family, part }]);
    }
}

/**
 * The CSS variables of the core enums (`PopoverPositionerCssVars`), from the declarations of core-components: the
 * machines set them on the elements.
 */
function coreCssVariables(ts) {
    const dist = join(dirname(require.resolve('@flippo-software/core-components/package.json')), 'dist');
    const enums = new Map();
    for (const file of readdirSync(dist).filter((name) => name.endsWith('.d.ts'))) {
        const source = ts.createSourceFile(file, readFileSync(join(dist, file), 'utf8'), ts.ScriptTarget.Latest, true);
        for (const node of source.statements.filter((statement) => ts.isEnumDeclaration(statement) && CSS_VARS.test(statement.name.text))) {
            enums.set(
                node.name.text,
                node.members
                    .filter((member) => member.initializer && ts.isStringLiteral(member.initializer))
                    .map((member) => {
                        const { description } = jsDocOf(ts, member);
                        return { name: member.initializer.text, ...(description && { description }) };
                    })
            );
        }
    }
    return enums;
}

/** The core enum of an element: `<Family><Part>CssVars`, or `<Family>CssVars` for a root (`checkbox` + `indicator`). */
function coreEnumOf(enums, registrations, className) {
    // The component the class is named after, when it is a part of several.
    const own = registrations.find(({ family }) => className.startsWith(pascalCase(family))) ?? registrations[0];
    const family = pascalCase(own.family);
    const candidates = own.part === 'root' ? [`${family}RootCssVars`, `${family}CssVars`] : [`${family}${pascalCase(own.part)}CssVars`];
    return candidates.map((name) => enums.get(name)).find(Boolean);
}

/** Fills a class declaration of the manifest from its `withAttributes` call and its events. */
function describeClass(ts, node, declaration, module) {
    if (declaration.name === 'MachineElement') {
        declaration.attributes = [AS_CHILD];
    }
    const call = withAttributesCall(ts, node);
    if (call) {
        const base = call.expression.expression.getText();
        declaration.superclass = { name: base, module: resolveImport(node.getSourceFile(), base, module) };
        const { attributes, fields } = readAttributes(ts, call.arguments[0]);
        declaration.attributes = [...attributes, ...(declaration.attributes ?? [])];
        declaration.members = [
            ...fields,
            ...(declaration.members ?? []).filter((member) => !fields.some((field) => field.name === member.name))
        ];
    }
    const events = readEvents(ts, node, declaration.description);
    if (events.length > 0) {
        declaration.events = events;
    }
}

/** Keeps the public API of a class and marks the registered ones as custom elements. */
function cleanClass(declaration, registered, cssVariables) {
    const registrations = registered.get(declaration.name);
    declaration.customElement = registrations !== undefined || undefined;
    const cssProperties = registrations && coreEnumOf(cssVariables, registrations, declaration.name);
    declaration.cssProperties = cssProperties?.length ? cssProperties : undefined;
    declaration.description = declaration.description?.split(SECTION)[0].trim();
    // No private, protected or static members of the implementation.
    declaration.members = declaration.members?.filter((member) => !(member.privacy || member.static || member.name.startsWith('#')));
    // The analyzer reads `withAttributes` as a mixin: it is the superclass.
    const mixins = declaration.mixins?.filter((mixin) => !mixin.name.endsWith('.withAttributes'));
    declaration.mixins = mixins?.length ? mixins : undefined;
}

function flippoElements() {
    const registered = new Map();
    let cssVariables = new Map();
    return {
        name: 'flippo-elements',
        initialize({ ts }) {
            cssVariables = coreCssVariables(ts);
        },
        analyzePhase({ ts, node, moduleDoc }) {
            const family = moduleDoc.path.match(COMPONENT_ENTRY)?.[1];
            if (family) {
                collectRegistered(ts, node, family, registered);
            }
            const declaration =
                ts.isClassDeclaration(node) &&
                moduleDoc.declarations.find((item) => item.kind === 'class' && item.name === node.name?.text);
            if (declaration) {
                describeClass(ts, node, declaration, moduleDoc.path);
            }
        },
        packageLinkPhase({ customElementsManifest }) {
            for (const declaration of customElementsManifest.modules.flatMap((module) => module.declarations ?? [])) {
                if (declaration.kind === 'class') {
                    cleanClass(declaration, registered, cssVariables);
                }
            }
        }
    };
}

export default {
    globs: ['src/**/*.ts'],
    exclude: ['src/**/*.test.ts', 'src/env.d.ts'],
    outdir: '.',
    // The `customElements` field of package.json is written by hand.
    packagejson: false,
    plugins: [flippoElements()]
};
