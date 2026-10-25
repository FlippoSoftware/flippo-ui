/** Public contracts for guides: descriptions, formatting and declaration comments are deliberately excluded. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { docsHash } from '@flippo-software/workspace-tools/docs-hash';
import ts from 'typescript';

type Named = { name: string; type?: string; default?: string; required?: boolean };
type ReactFamily = { parts: { name: string; props: Named[] }[] };
type WebItem = { name: string; type?: { text: string }; default?: string };
type WebDeclaration = {
    kind: string;
    name: string;
    default?: string;
    customElement?: boolean;
    attributes?: WebItem[];
    events?: WebItem[];
    cssProperties?: WebItem[];
};
type Manifest = { modules: { path: string; declarations?: WebDeclaration[] }[] };

/** Sort object keys; array order is retained unless the contract explicitly treats its items as a set. */
export function canonical(value: unknown): string {
    if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
    if (value !== null && typeof value === 'object') {
        return `{${Object.entries(value)
            .filter(([, item]) => item !== undefined)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
            .join(',')}}`;
    }
    return JSON.stringify(value);
}

const byName = <T extends { name: string }>(items: T[]): T[] => [...items].sort((left, right) => left.name.localeCompare(right.name));
const hash = (value: unknown) => docsHash(canonical(value));

/** TypeScript tokens preserve literal whitespace, but skip all comments and formatting. */
export function declarationTokens(source: string): string[] {
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, source);
    const tokens: string[] = [];
    while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) tokens.push(scanner.getTokenText());
    return tokens;
}

export function reactContract(family: ReactFamily): string {
    return hash(
        byName(family.parts).map((part) => ({
            name: part.name,
            props: byName(part.props).map(({ name, type, default: initial, required }) => ({
                name,
                type: type === undefined ? undefined : declarationTokens(type),
                default: initial === undefined ? undefined : declarationTokens(initial),
                required
            }))
        }))
    );
}

export function webContract(manifest: Manifest, name: string): string {
    const entry = manifest.modules.find((module) => module.path === `src/components/${name}/index.ts`);
    const elements = entry?.declarations?.find((declaration) => declaration.name === 'elements')?.default?.trim();
    if (!elements) throw new Error(`Unknown web component: ${name}`);
    const parts: [string, string][] = elements.startsWith('{')
        ? [...elements.matchAll(/(\w+)\s*:\s*(\w+)/g)].map(([, part, element]) => [part, element])
        : [['root', elements]];
    if (parts.length === 0) throw new Error(`No registered elements for web:${name}`);
    const declarations = manifest.modules.flatMap((module) => module.declarations ?? []);
    const typed = (items: WebItem[] = []) =>
        byName(items).map((item) => ({
            name: item.name,
            type: item.type ? declarationTokens(item.type.text) : undefined,
            default: item.default === undefined ? undefined : declarationTokens(item.default)
        }));
    return hash(
        parts
            .map(([part, className]) => {
                const declaration = declarations.find((item) => item.kind === 'class' && item.name === className);
                if (!declaration?.customElement) throw new Error(`web:${name}: registered class ${className} is missing`);
                const suffix = part === 'root' ? '' : `-${part.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
                return {
                    name: `${name}${suffix}`,
                    part,
                    attributes: typed(declaration.attributes),
                    events: typed(declaration.events),
                    cssProperties: byName(declaration.cssProperties ?? []).map((item) => item.name)
                };
            })
            .sort((left, right) => left.name.localeCompare(right.name))
    );
}

function namesOf(statement: ts.Statement): string[] {
    if (ts.isVariableStatement(statement)) {
        return statement.declarationList.declarations.flatMap((item) => (ts.isIdentifier(item.name) ? [item.name.text] : []));
    }
    if (
        (ts.isFunctionDeclaration(statement) ||
            ts.isClassDeclaration(statement) ||
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement) ||
            ts.isEnumDeclaration(statement)) &&
        statement.name
    ) {
        return [statement.name.text];
    }
    return [];
}

function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
    return ts.canHaveModifiers(node) && (ts.getModifiers(node)?.some((modifier) => modifier.kind === kind) ?? false);
}

function declarationIndex(file: ts.SourceFile) {
    const definitions = new Map<string, ts.Statement[]>();
    const exported = new Map<string, string>();
    for (const statement of file.statements) {
        for (const name of namesOf(statement)) {
            definitions.set(name, [...(definitions.get(name) ?? []), statement]);
            if (hasModifier(statement, ts.SyntaxKind.ExportKeyword)) exported.set(name, name);
        }
        if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
            for (const element of statement.exportClause.elements)
                exported.set(element.name.text, (element.propertyName ?? element.name).text);
        }
    }
    return { definitions, exported };
}

function declarationImports(file: ts.SourceFile) {
    const imports = new Map<string, string>();
    for (const statement of file.statements) {
        if (
            ts.isImportDeclaration(statement) &&
            statement.importClause?.namedBindings &&
            ts.isNamedImports(statement.importClause.namedBindings)
        ) {
            const module = ts.isStringLiteral(statement.moduleSpecifier) ? statement.moduleSpecifier.text : '';
            for (const element of statement.importClause.namedBindings.elements) {
                // Bundlers disambiguate repeated imports with $1; those names and chunk hashes are not API changes.
                const original = (element.propertyName ?? element.name).text;
                imports.set(element.name.text, module.startsWith('.') ? element.name.text.replace(/\$\d+$/, '') : `${module}:${original}`);
            }
        }
    }
    return imports;
}

function publicDeclaration(statement: ts.Statement): ts.Statement {
    if (!ts.isClassDeclaration(statement)) return statement;
    return ts.factory.updateClassDeclaration(
        statement,
        statement.modifiers,
        statement.name,
        statement.typeParameters,
        statement.heritageClauses,
        statement.members.filter((member) => !hasModifier(member, ts.SyntaxKind.PrivateKeyword))
    );
}

/** Only the selected declaration signatures and their local type dependencies; no implementations or private fields. */
export function themeDeclarations(source: string, names?: readonly string[]): string {
    const file = ts.createSourceFile('contract.d.ts', source, ts.ScriptTarget.Latest, true);
    const { definitions, exported } = declarationIndex(file);
    const imports = declarationImports(file);
    const selected = new Set<ts.Statement>();
    const publicNames = names ?? [...exported.keys()];
    const pending = publicNames.map((name) => {
        const local = exported.get(name);
        if (!local || !definitions.has(local)) throw new Error(`Missing public theme declaration: ${name}`);
        return local;
    });
    while (pending.length > 0) {
        const name = pending.pop() as string;
        for (const statement of definitions.get(name) ?? []) {
            if (selected.has(statement)) continue;
            selected.add(statement);
            const visit = (node: ts.Node) => {
                if (hasModifier(node, ts.SyntaxKind.PrivateKeyword)) return;
                if (ts.isIdentifier(node) && definitions.has(node.text)) pending.push(node.text);
                ts.forEachChild(node, visit);
            };
            visit(statement);
        }
    }
    const printer = ts.createPrinter({ removeComments: true });
    const declarations = [...selected].map((statement) => {
        return declarationTokens(printer.printNode(ts.EmitHint.Unspecified, publicDeclaration(statement), file)).map(
            (token) => imports.get(token) ?? token
        );
    });
    return canonical({
        exports: [...publicNames].sort(),
        declarations: declarations.sort((left, right) => canonical(left).localeCompare(canonical(right)))
    });
}

const THEME_SYMBOLS: Record<string, readonly string[]> = {
    'ui-kit-react': ['FlippoProvider', 'FlippoProviderProps', 'ThemeScript', 'useTheme', 'useControlSize'],
    'ui-kit-web': [
        'define',
        'DefineOptions',
        'ProviderElement',
        'setTheme',
        'getTheme',
        'subscribeTheme',
        'registerThemes',
        'persistTheme',
        'setControlSize',
        'getControlSize'
    ]
};

/** Explicit public constants are values in the guides, even where declaration emit widens their types. */
function constantValues(source: string, names: readonly string[]): unknown {
    const file = ts.createSourceFile('constants.ts', source, ts.ScriptTarget.Latest, true);
    const values = new Map<string, string[]>();
    for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement) || !hasModifier(statement, ts.SyntaxKind.ExportKeyword)) continue;
        for (const declaration of statement.declarationList.declarations) {
            if (ts.isIdentifier(declaration.name) && names.includes(declaration.name.text) && declaration.initializer) {
                values.set(declaration.name.text, declarationTokens(declaration.initializer.getText(file)));
            }
        }
    }
    for (const name of names) if (!values.has(name)) throw new Error(`Missing public theme constant: ${name}`);
    return Object.fromEntries(values);
}

function providerAttributes(source: string): string[] {
    const file = ts.createSourceFile('provider.ts', source, ts.ScriptTarget.Latest, true);
    const provider = file.statements.find(
        (statement): statement is ts.ClassDeclaration => ts.isClassDeclaration(statement) && statement.name?.text === 'ProviderElement'
    );
    const field = provider?.members.find(
        (member): member is ts.PropertyDeclaration =>
            ts.isPropertyDeclaration(member) && ts.isIdentifier(member.name) && member.name.text === 'observedAttributes'
    );
    if (!field?.initializer) throw new Error('Missing ProviderElement.observedAttributes');
    return declarationTokens(field.initializer.getText(file));
}

function themeContract(read: (file: string) => string, name: string): string {
    if (name === 'component-styles') {
        const themeMixin = read('packages/component-styles/scss/mixins/_tokens.scss').match(/@mixin\s+theme\s*\([\s\S]*?\)\s*\{/);
        if (!themeMixin) throw new Error('Missing public theme SCSS mixin');
        return hash({
            declarations: ['theme', 'sizes'].map((entry) => themeDeclarations(read(`packages/${name}/dist/${entry}.d.ts`))),
            sizes: constantValues(read(`packages/${name}/src/sizes/index.ts`), [
                'CONTROL_SIZES',
                'DEFAULT_CONTROL_SIZE',
                'CONTROL_HEIGHTS'
            ]),
            themes: constantValues(read(`packages/${name}/src/theme/index.ts`), [
                'BUILT_IN_THEMES',
                'THEME_ATTRIBUTE',
                'DEFAULT_THEME_STORAGE_KEY'
            ]),
            mixin: declarationTokens(themeMixin[0])
        });
    }
    const symbols = THEME_SYMBOLS[name];
    if (!symbols) throw new Error(`Unknown theme package: ${name}`);
    const declarations = themeDeclarations(read(`packages/${name}/dist/index.d.ts`), symbols);
    if (name === 'ui-kit-web') {
        return hash({
            declarations,
            registration: themeDeclarations(read(`packages/${name}/src/lib/register.ts`), ['DefineOptions']),
            attributes: providerAttributes(read(`packages/${name}/src/lib/provider.ts`))
        });
    }
    return docsHash(declarations);
}

function exportsContract(pkg: { exports?: unknown; peerDependencies?: unknown }, name: string): string {
    if (!pkg.exports) throw new Error(`No public entry points in exports:${name}`);
    // Conditional export order is significant to Node. Preserve it while sorting only entry-point names.
    const entries =
        typeof pkg.exports === 'object' && pkg.exports !== null && Object.keys(pkg.exports).every((key) => key.startsWith('.'))
            ? Object.entries(pkg.exports)
                  .sort(([left], [right]) => left.localeCompare(right))
                  .map(([key, value]) => [key, JSON.stringify(value)])
            : JSON.stringify(pkg.exports);
    return hash({ exports: entries, peerDependencies: pkg.peerDependencies });
}

/** Resolve only known public namespaces; a typo or missing build is an error, never an empty contract. */
export function contractHash(root: string, contract: string): string {
    const match = /^(react|web|core|npm|exports|theme):([\w-]+)$/.exec(contract);
    if (!match) throw new Error(`Invalid contract: ${contract}`);
    const [, kind, name] = match;
    const read = (file: string) => readFileSync(join(root, file), 'utf8');
    const json = (file: string): unknown => JSON.parse(read(file));
    switch (kind) {
        case 'react': {
            const family = (json('tools/storybook/api.json') as Record<string, ReactFamily>)[name];
            if (!family?.parts?.length) throw new Error(`Unknown React family: ${name}`);
            return reactContract(family);
        }
        case 'web':
            return webContract(json('packages/web-components/custom-elements.json') as Manifest, name);
        case 'core': {
            const values = (json('tools/storybook/core-enums.json') as Record<string, Named[]>)[name];
            if (!values) throw new Error(`Unknown core enum: ${name}`);
            return hash(byName(values).map((value) => value.name));
        }
        case 'npm': {
            const report = read(`packages/${name}/etc/${name}.api.md`);
            const code = [...report.matchAll(/```(?:ts|typescript)\r?\n([\s\S]*?)```/g)].map((block) => block[1]).join('\n');
            if (!code) throw new Error(`No API declarations in npm:${name}`);
            return hash(declarationTokens(code));
        }
        case 'exports': {
            const pkg = json(`packages/${name}/package.json`) as { exports?: unknown; peerDependencies?: unknown };
            return exportsContract(pkg, name);
        }
        case 'theme':
            return themeContract(read, name);
        default:
            throw new Error(`Unknown contract: ${contract}`);
    }
}
