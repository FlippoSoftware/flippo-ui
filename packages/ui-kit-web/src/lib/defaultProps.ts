import { Store } from '@flippo-software/store';

import type { components } from '~@src/define';

/**
 * Default props of the families, by family (`button`, `select`, `navigationMenu`): the family's own properties (its
 * root element, or its only element) and, under a part's name, the properties of that part.
 *
 * @example { button: { size: 'small' }, select: { size: 'small', positioner: { sideOffset: 4 } } }
 */
export type DefaultPropsConfig = Readonly<Record<string, Readonly<Record<string, unknown>> | undefined>>;

type PropsOf<Element> = Element extends abstract new (
    ...args: never[]
) => infer Instance
    ? Partial<Omit<Instance, keyof HTMLElement>>
    : never;

type FamilyDefaults<Elements> = Elements extends abstract new (
    ...args: never[]
) => unknown
    ? PropsOf<Elements>
    : Elements extends { root: infer Root }
      ? PropsOf<Root> & { [Part in Exclude<keyof Elements, 'root'>]?: PropsOf<Elements[Part]> }
      : never;

/** Default props of the kit, typed from its families and their elements. */
export type DefaultProps = { [Family in keyof typeof components]?: FamilyDefaults<(typeof components)[Family]> };

const FAMILY = Symbol('default props family');
const PART = Symbol('default props part');

type Registered = { [FAMILY]?: string; [PART]?: string };

/** Marks a registered element class with its family (camelCase) and part (none for the root or only element). */
export function markRegistered(Element: CustomElementConstructor, family: string, part: string | undefined): void {
    (Element as Registered)[FAMILY] = family.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    (Element as Registered)[PART] = part;
}

const globalDefaults = new Store<{ value: DefaultPropsConfig }>({ value: {} });

/** Sets the default props of every element of the kit (under a `<prefix>-default-props`, its own win). */
export function setDefaultProps(defaults: DefaultProps): void {
    globalDefaults.set('value', defaults as DefaultPropsConfig);
}

/** The number of connected providers: while there is none, an element reads the global defaults only. */
const providers = new Store<{ count: number }>({ count: 0 });

/**
 * Default props for the elements inside it, over the global ones (`define({ defaults })`): set its `defaults`
 * property. Nested elements merge with the outer ones, family by family and part by part.
 */
export class DefaultPropsElement extends HTMLElement {
    private readonly store = new Store<{ value: DefaultPropsConfig }>({ value: {} });

    get defaults(): DefaultProps {
        return this.store.state.value as DefaultProps;
    }

    set defaults(defaults: DefaultProps) {
        this.store.set('value', defaults as DefaultPropsConfig);
    }

    connectedCallback() {
        providers.set('count', providers.state.count + 1);
        this.style.display = 'contents';
    }

    disconnectedCallback() {
        providers.set('count', providers.state.count - 1);
    }
}

function parent(element: Element): Element | null {
    return element.parentElement ?? (element.getRootNode() as ShadowRoot).host ?? null;
}

function lookup(config: DefaultPropsConfig, family: string, part: string | undefined, key: string): unknown {
    const props = config[family];
    if (!props) return undefined;
    const own = part ? (props[part] as Readonly<Record<string, unknown>> | undefined) : props;
    return own?.[key];
}

/**
 * The configured value of `key` for an element: from the closest `<prefix>-default-props` that sets it, then from
 * the global defaults. Reads are tracked: the elements update when the defaults change. `familyLevel` reads the
 * family's own entry, whatever the element's part (the variants of a part rendered without its root).
 */
export function configuredProp(element: HTMLElement, key: string, familyLevel = false): unknown {
    const { [FAMILY]: family, [PART]: part } = element.constructor as Registered;
    if (!family) return undefined;
    const ownPart = familyLevel ? undefined : part;
    if (providers.state.count > 0) {
        for (let ancestor = parent(element); ancestor; ancestor = parent(ancestor)) {
            if (ancestor instanceof DefaultPropsElement) {
                const value = lookup(ancestor.defaults as DefaultPropsConfig, family, ownPart, key);
                if (value !== undefined) return value;
            }
        }
    }
    return lookup(globalDefaults.state.value, family, ownPart, key);
}
