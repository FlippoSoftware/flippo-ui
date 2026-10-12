import { markRegistered } from './defaultProps';

export type DefineOptions = { prefix: string; registry?: CustomElementRegistry };
export type Elements = CustomElementConstructor | Readonly<Record<string, CustomElementConstructor>>;
const PREFIX = /^[a-z][a-z0-9-]*$/;
export function registerElements(name: string, elements: Elements, { prefix, registry = customElements }: DefineOptions) {
    if (!PREFIX.test(prefix)) throw new Error(`Invalid tag prefix: ${prefix}`);
    const entries = typeof elements === 'function' ? [['root', elements] as const] : Object.entries(elements);
    for (const [part, Element] of entries) {
        const suffix = part === 'root' ? '' : `-${part.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
        const tag = `${prefix}-${name}${suffix}`;
        if (registry.get(tag)) continue;
        const Registered = class extends Element {};
        markRegistered(Registered, name, part === 'root' ? undefined : part);
        registry.define(tag, Registered);
    }
}
