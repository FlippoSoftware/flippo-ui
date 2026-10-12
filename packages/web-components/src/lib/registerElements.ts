export type DefineOptions = {
    /**
     * The tag prefix: `ui` registers `ui-toggle`, `ui-collapsible`, `ui-collapsible-trigger`… Required, so that the
     * names never collide with another library's: pick one for your project.
     */
    prefix: string;
    /**
     * The registry to register in (`customElements` by default), e.g. a scoped one.
     */
    registry?: CustomElementRegistry | undefined;
};

/**
 * The elements of a component: one element, or its parts by name (`root` and the others).
 */
export type ComponentElements = CustomElementConstructor | Readonly<Record<string, CustomElementConstructor>>;

const PREFIX = /^[a-z][a-z0-9-]*$/;

const UPPER_CASE = /[A-Z]/g;

function toKebabCase(name: string): string {
    return name.replace(UPPER_CASE, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Registers the elements of a component as `<prefix>-<tag>` tags: `root` (or a lone element) gets the name of the
 * component, the other parts `<component>-<part>` (`menu` + `linkItem` → `menu-link-item`). A name already registered
 * is skipped, so components may be registered by several modules.
 */
export function registerElements(component: string, elements: ComponentElements, options: DefineOptions) {
    const { prefix, registry = customElements } = options;
    if (!PREFIX.test(prefix)) {
        throw new Error(`Invalid tag prefix "${prefix}": use lowercase letters, digits and hyphens, starting with a letter.`);
    }
    const name = toKebabCase(component);
    const tags: [string, CustomElementConstructor][] =
        typeof elements === 'function'
            ? [[name, elements]]
            : Object.entries(elements).map(([part, element]) => [part === 'root' ? name : `${name}-${toKebabCase(part)}`, element]);
    for (const [tag, element] of tags) {
        const tagName = `${prefix}-${tag}`;
        if (registry.get(tagName)) {
            continue;
        }
        // A constructor can only be registered once: every name gets its own subclass.
        registry.define(tagName, class extends (element as typeof HTMLElement) {});
    }
}
