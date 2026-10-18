import { focusControlOnPress } from '@flippo-software/component-styles/dom';
import { extractPresentationProps } from '@flippo-software/component-styles/layouts';
import { MachineElement } from '@flippo-software/web-components';

import type {
    BoxProps,
    ContainerLayoutProps,
    FlexLayoutProps,
    GridLayoutProps,
    SectionLayoutProps
} from '@flippo-software/component-styles/layouts';
import type { AttributeSpecs, AttributeType } from '@flippo-software/web-components';

import { configuredProp } from './defaultProps';
import { fallbackSize } from './provider';

export type Recipe = ((props: never) => string | Record<string, string>) & {
    readonly variantKeys: readonly string[];
    readonly variantOptions: Readonly<Record<string, readonly unknown[]>>;
};
type Variants<R extends Recipe> = Partial<Omit<NonNullable<Parameters<R>[0]>, 'className' | 'classNames'>>;
type Constructor = typeof MachineElement & (new () => MachineElement);
type LayoutProperties<K> = K extends 'flex'
    ? FlexLayoutProps
    : K extends 'grid'
      ? GridLayoutProps
      : K extends 'container'
        ? ContainerLayoutProps
        : K extends 'section'
          ? SectionLayoutProps
          : K extends string
            ? BoxProps
            : unknown;
export type StyledConstructor<B extends Constructor, R extends Recipe, K extends string | undefined = undefined> = B &
    (new () => InstanceType<B> & Variants<R> & LayoutProperties<K>);
type ElementProps = Record<string, unknown> & { style?: Record<string, unknown>; className?: string };
const FAMILY = Symbol('styled family');
const ROOT = Symbol('styled root');
type StyledIdentity = Element & { [FAMILY]?: string; [ROOT]?: boolean };
const UPPERCASE = /[A-Z]/g;
const INTEGER = /^\d+$/;
const kebab = (value: string) => value.replace(UPPERCASE, (letter) => `-${letter.toLowerCase()}`);

/** Presentation parts use the headless as-child, attribute and cleanup lifecycle. */
export class PresentationElement extends MachineElement {
    protected override createParts() {}
    protected override applyOptions() {}
    protected override connectParts() {
        return () => {};
    }
    protected override getProps(): ElementProps {
        return {};
    }
}

const layoutKeys = [
    'm',
    'mx',
    'my',
    'mt',
    'mr',
    'mb',
    'ml',
    'p',
    'px',
    'py',
    'pt',
    'pr',
    'pb',
    'pl',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'position',
    'inset',
    'top',
    'right',
    'bottom',
    'left',
    'zIndex',
    'overflow',
    'overflowX',
    'overflowY',
    'display',
    'grow',
    'shrink',
    'basis',
    'flex',
    'alignSelf',
    'order',
    'colSpan',
    'rowSpan',
    'gridColumn',
    'gridColumnStart',
    'gridColumnEnd',
    'gridRow',
    'gridRowStart',
    'gridRowEnd',
    'gridArea',
    'justifySelf',
    'placeSelf',
    'inline',
    'direction',
    'wrap',
    'flow',
    'justify',
    'align',
    'alignContent',
    'gap',
    'rowGap',
    'columnGap',
    'columns',
    'rows',
    'areas',
    'template',
    'autoColumns',
    'autoRows',
    'autoFlow',
    'justifyItems',
    'placeItems',
    'placeContent',
    'spacing'
] as const;
const numbers = new Set(['grow', 'shrink', 'order', 'colSpan', 'rowSpan', 'zIndex', 'spacing']);
const layoutSpecs = Object.fromEntries(
    layoutKeys.map((key) => [kebab(key), key === 'inline' ? 'boolean' : numbers.has(key) ? 'number' : 'string'])
) as AttributeSpecs;

function read(element: Element, name: string): unknown {
    return (element as unknown as Record<string, unknown>)[name];
}
function parent(element: Element): Element | null {
    return element.parentElement ?? (element.getRootNode() as ShadowRoot).host ?? null;
}
export function familyRoot(element: Element, family: string): Element | null {
    let ancestor = parent(element) as StyledIdentity | null;
    while (ancestor) {
        if (ancestor[FAMILY] === family && ancestor[ROOT]) return ancestor;
        ancestor = parent(ancestor);
    }
    return null;
}
function readVariants(element: Element, recipe: Recipe): Record<string, unknown> {
    const selected: Record<string, unknown> = {};
    for (const key of recipe.variantKeys) {
        const value = read(element, key);
        if (value !== undefined) selected[key] = value;
    }
    return selected;
}
/**
 * The variants configured for the element's family, then the control size of its subtree: the fallback of a part
 * rendered without its root.
 */
function familyVariants(element: HTMLElement, recipe: Recipe, family: string): Record<string, unknown> {
    const selected: Record<string, unknown> = {};
    for (const key of recipe.variantKeys) {
        const value = configuredProp(element, key, true) ?? (key === 'size' ? fallbackSize(element, family) : undefined);
        if (value !== undefined) selected[key] = value;
    }
    return selected;
}
const camel = (value: string) => value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
function layoutStyle(element: Element, kind: string): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const key of layoutKeys) values[key] = read(element, key);
    values.size = read(element, 'size');
    if (typeof values.columns === 'string' && INTEGER.test(values.columns)) values.columns = Number(values.columns);
    return Object.fromEntries(Object.entries(extractPresentationProps(kind, values).style).filter(([, value]) => value !== undefined));
}

export type StyledOptions = {
    /**
     * Values of the element's properties while their attribute is absent (`keepMounted: true`, `sideOffset: 8`): the
     * styled design needs them, and an attribute or a property set by the user still wins.
     */
    defaults?: Record<string, unknown>;
    /**
     * The part keeps no classes of its own with `as-child`: a `<x-dialog-close>` is the styled close icon, but
     * `<x-dialog-close as-child><x-button>Done</x-button></x-dialog-close>` is that button.
     */
    bareAsChild?: boolean;
    /** Markup the part gets when it is empty: the default icon of an indicator, a chevron, a close button. */
    content?: string;
    /** A press on the part (a control box) focuses the input inside it, like a press on the input itself. */
    focusControlOnPress?: boolean;
    /** Like `defaults`, for values computed from the element (an anchor found next to it). */
    compute?: Record<string, (element: HTMLElement) => unknown>;
};

/** Defines a getter that falls back to `fallback(element)` while the inherited accessor reports nothing (attribute absent). */
function defineDefault(prototype: object, key: string, fallback: (element: HTMLElement) => unknown) {
    let owner: object | null = Object.getPrototypeOf(prototype);
    let descriptor: PropertyDescriptor | undefined;
    while (owner && !descriptor) {
        descriptor = Object.getOwnPropertyDescriptor(owner, key);
        owner = Object.getPrototypeOf(owner);
    }
    if (!descriptor?.get) throw new Error(`styled(): no "${key}" property to give a default to.`);
    const { get, set } = descriptor;
    Object.defineProperty(prototype, key, {
        configurable: true,
        get(this: HTMLElement) {
            return get.call(this) ?? fallback(this);
        },
        set(next: unknown) {
            set?.call(this, next);
        }
    });
}

function slotClasses(result: string | Record<string, string>, slot: string | undefined): string | undefined {
    if (typeof result === 'string') return result;
    return slot ? result[slot] : undefined;
}

/** Styling participates in the existing effect: reads of root variant properties remain reactive. */
export function styled<B extends Constructor, R extends Recipe, K extends string | undefined = undefined>(
    Base: B,
    recipe: R,
    family: string,
    slot?: string,
    root = false,
    layout?: K,
    options: StyledOptions = {}
): StyledConstructor<B, R, K> {
    const specs: Record<string, AttributeType> = layout ? { ...layoutSpecs } : {};
    for (const key of recipe.variantKeys) {
        const values = recipe.variantOptions[key] ?? [];
        specs[kebab(key)] = values.every((value) => value === 'true' || value === 'false' || typeof value === 'boolean')
            ? 'boolean'
            : 'string';
    }
    const Extended = Base.withAttributes(specs) as unknown as typeof PresentationElement;
    class StyledElement extends Extended {
        readonly [FAMILY] = family;
        readonly [ROOT] = root;
        override connectedCallback() {
            if (options.focusControlOnPress) this.addEventListener('mousedown', this.focusControl);
            if (options.content && !this.asChild && this.childElementCount === 0 && !this.textContent?.trim()) {
                this.innerHTML = options.content;
            }
            super.connectedCallback();
        }
        private readonly focusControl = (event: MouseEvent) =>
            focusControlOnPress(event, this.asChild ? (this.firstElementChild ?? this) : this);
        override disconnectedCallback() {
            this.removeEventListener('mousedown', this.focusControl);
            super.disconnectedCallback();
        }
        protected override getProps(target?: HTMLElement): ElementProps {
            const props = (Base.prototype as unknown as { getProps(target?: HTMLElement): ElementProps }).getProps.call(this, target);
            const ancestor = root ? null : familyRoot(this, family);
            const inherited = ancestor ? readVariants(ancestor, recipe) : root ? {} : familyVariants(this, recipe, family);
            const selected = { ...inherited, ...readVariants(this, recipe) };
            const classes = options.bareAsChild === true && this.asChild ? undefined : slotClasses(recipe(selected as never), slot);
            const style = layout ? { ...layoutStyle(this, layout), ...props.style } : props.style;
            return { ...props, ...(style ? { style } : {}), className: [props.className, classes].filter(Boolean).join(' ') };
        }
    }
    // Absent attributes fall back to the default props (`define({ defaults })`, `<prefix>-default-props`), then to the
    // kit's own defaults; a control's size to the control size of its subtree (`<prefix>-provider size`, `define({ size })`).
    const builtin: Record<string, (element: HTMLElement) => unknown> = {
        ...Object.fromEntries(Object.entries(options.defaults ?? {}).map(([key, value]) => [key, () => value])),
        ...options.compute
    };
    const keys = new Set([
        ...Object.keys((StyledElement as unknown as typeof MachineElement).attributes).map(camel),
        ...Object.keys(builtin)
    ]);
    for (const key of keys) {
        defineDefault(
            StyledElement.prototype,
            key,
            (element) =>
                configuredProp(element, key) ?? builtin[key]?.(element) ?? (key === 'size' ? fallbackSize(element, family) : undefined)
        );
    }
    return StyledElement as unknown as StyledConstructor<B, R, K>;
}
