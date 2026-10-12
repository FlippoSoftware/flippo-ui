// biome-ignore-all lint/complexity/noThisInStatic: static members refer to the registered subclass, not to this base class.
import { batch, effect, Store, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { PropsApplier } from './PropsApplier';

declare const PROPERTY_VALUE: unique symbol;

/**
 * An option that is a property only, without an attribute: values that are not strings (objects, functions).
 */
export type PropertySpec<Value> = { readonly kind: 'property'; readonly [PROPERTY_VALUE]?: Value };

/**
 * Declares a property-only option of type `Value`, e.g. `{ format: property<Intl.NumberFormatOptions>() }`.
 */
export function property<Value>(): PropertySpec<Value> {
    return { kind: 'property' };
}

/**
 * How an attribute maps to a property: `boolean` (present or not), `string`, `number`, or one of a list of values
 * (other values are `undefined`); or a property without an attribute ({@link property}).
 */
export type AttributeType = 'boolean' | 'string' | 'number' | readonly string[] | PropertySpec<unknown>;

/**
 * Attributes of an element, by attribute name (kebab-case). The property has the camelCase name.
 */
export type AttributeSpecs = Readonly<Record<string, AttributeType>>;

type CamelCase<Name extends string> = Name extends `${infer Head}-${infer Tail}` ? `${Head}${Capitalize<CamelCase<Tail>>}` : Name;

type AttributeValue<Type extends AttributeType> =
    Type extends PropertySpec<infer Value>
        ? Value
        : Type extends readonly (infer Option)[]
          ? Option
          : Type extends 'boolean'
            ? boolean
            : Type extends 'number'
              ? number
              : string;

/**
 * The properties of attributes: `{ 'default-open': 'boolean' }` → `{ defaultOpen: boolean | undefined }`.
 */
export type AttributeProperties<Specs extends AttributeSpecs> = {
    -readonly [Name in keyof Specs & string as CamelCase<Name>]: AttributeValue<Specs[Name]> | undefined;
};

// biome-ignore lint/suspicious/noExplicitAny: a class extended by a mixin must take `...args: any[]`.
type ElementClass<Instance = MachineElement> = abstract new (...args: any[]) => Instance;

const AS_CHILD = 'as-child';

/**
 * Base class of the elements: maps attributes and properties to the options of core machines, applies the props of
 * the machines to the element (or, with `as-child`, to its only child element), and connects the machines while the
 * element is in the document.
 *
 * Subclasses extend `MachineElement.withAttributes({ … })` to declare their attributes, create their machines in
 * {@link createParts}, push the options in {@link applyOptions} and return the props in {@link getProps}.
 *
 * - Attribute and property changes are applied together, in a microtask (one `setOptions` per change set).
 * - An attribute that is absent is `undefined`, so a controlled option (`open`) stays uncontrolled until it is set.
 * - Properties take any value (arrays, functions): frameworks set them directly.
 */
export abstract class MachineElement extends HTMLElement {
    /**
     * The attributes of the class (set by {@link withAttributes}).
     */
    static attributes: AttributeSpecs = {};

    static get observedAttributes(): string[] {
        return [...Object.keys(this.attributes).filter((name) => !isPropertySpec(this.attributes[name])), AS_CHILD];
    }

    /**
     * A base class with the given attributes: each one gets a property (camelCase) whose type is inferred from the
     * attribute type, and the attribute is observed.
     *
     * @example
     * class ToggleElement extends MachineElement.withAttributes({ pressed: 'boolean', 'default-pressed': 'boolean' }) {
     *     // this.pressed: boolean | undefined, this.defaultPressed: boolean | undefined
     * }
     */
    static withAttributes<Base extends ElementClass, const Specs extends AttributeSpecs>(
        this: Base,
        specs: Specs
    ): Base & ElementClass<AttributeProperties<Specs>> {
        const base = this as unknown as typeof MachineElement;
        abstract class WithAttributes extends (this as ElementClass) {}
        (WithAttributes as unknown as typeof MachineElement).attributes = { ...base.attributes, ...specs };
        for (const attribute of Object.keys(specs)) {
            const property = toPropertyName(attribute);
            Object.defineProperty(WithAttributes.prototype, property, {
                configurable: true,
                enumerable: true,
                get(this: MachineElement) {
                    return this.values.state[property];
                },
                set(this: MachineElement, value: unknown) {
                    this.setValue(property, value);
                }
            });
        }
        return WithAttributes as unknown as Base & ElementClass<AttributeProperties<Specs>>;
    }

    /**
     * The values of the attributes and properties, by property name. A store, so that what reads them (e.g. the
     * props) follows them.
     */
    private readonly values = new Store<Record<string, unknown>>({});

    /**
     * The element the props are applied to: the element itself, or its child with `as-child`. A plain field: every
     * target gets its own effect.
     */
    private targetElement: HTMLElement | null = null;

    /**
     * Stops the effect applying the props to the current target.
     */
    private stopApplying: (() => void) | null = null;

    /**
     * Whether the props are applied (the machines are connected).
     */
    private applying = false;

    /**
     * Whether the target had an `id` before the props were applied: the page's id is kept (the machines use the id of
     * the element when it has one, e.g. for `aria-controls`).
     */
    private targetHasPageId = false;

    private readonly applier = new PropsApplier(
        (name) => (name === 'id' && this.targetHasPageId) || (this.targetElement === this && this.isOwnAttribute(name))
    );

    private created = false;

    private ready = false;

    private updateScheduled = false;

    private cleanups: Array<() => void> = [];

    private childObserver: MutationObserver | null = null;

    constructor() {
        super();
        // Properties set before the element was upgraded are own properties that shadow the accessors.
        const specs = (this.constructor as typeof MachineElement).attributes;
        for (const attribute of Object.keys(specs)) {
            const property = toPropertyName(attribute);
            if (Object.hasOwn(this, property)) {
                const value = (this as Record<string, unknown>)[property];
                delete (this as Record<string, unknown>)[property];
                this.setValue(property, value);
            }
        }
    }

    /**
     * Whether the props go to the only child element (`as-child`) instead of this element.
     */
    get asChild(): boolean {
        return this.hasAttribute(AS_CHILD);
    }

    set asChild(value: boolean) {
        this.toggleAttribute(AS_CHILD, value);
    }

    attributeChangedCallback(name: string, _previous: string | null, value: string | null) {
        if (name === AS_CHILD) {
            if (this.isConnected && this.ready) {
                this.observeTarget();
            }
            return;
        }
        const type = (this.constructor as typeof MachineElement).attributes[name];
        if (type && !isPropertySpec(type)) {
            this.setValue(toPropertyName(name), parseAttribute(value, type));
        }
    }

    connectedCallback() {
        this.whenReady(() => {
            if (!this.isConnected) {
                return;
            }
            if (!this.created) {
                this.created = true;
                this.createParts();
            }
            this.ready = true;
            this.flushOptions();
            this.observeTarget();
            this.cleanups.push(this.connectParts());
            this.applying = true;
            this.applyToTarget();
            this.cleanups.push(() => {
                this.applying = false;
                this.stopApplying?.();
                this.stopApplying = null;
            });
        });
    }

    disconnectedCallback() {
        this.ready = false;
        this.childObserver?.disconnect();
        this.childObserver = null;
        const cleanups = this.cleanups;
        this.cleanups = [];
        for (let i = cleanups.length - 1; i >= 0; i -= 1) {
            cleanups[i]?.();
        }
        this.setTarget(null);
    }

    /**
     * Calls `callback` once the element can create its parts (e.g. once the context of a compound component is
     * provided). By default right away.
     */
    protected whenReady(callback: () => void) {
        callback();
    }

    /**
     * Creates the machines. Called once, on the first connection.
     */
    protected abstract createParts(): void;

    /**
     * Pushes the current options to the machines. Runs in a `batch`.
     */
    protected abstract applyOptions(): void;

    /**
     * Applies the side effects of the options (the machines' `afterCommit`).
     */
    protected afterOptions(): void {}

    /**
     * Connects the machines. Returns a function that disconnects them.
     */
    protected abstract connectParts(): () => void;

    /**
     * Props for the target element. Runs in an effect: the stores the machines read are tracked.
     */
    protected abstract getProps(target: HTMLElement): Props;

    /**
     * The target element changed (connection, `as-child`, child replaced).
     */
    protected onTargetChange(_element: HTMLElement | null): void {}

    /**
     * `element` is no longer the target: undo what was done to it outside the props (the props are removed already).
     */
    protected onTargetRelease(_element: HTMLElement): void {}

    /**
     * The element the props are applied to.
     */
    protected get target(): HTMLElement | null {
        return this.targetElement;
    }

    /**
     * The id of the target: one written by the page is kept, otherwise `generated` is used. Known before the target
     * is set (when the parts are created), so that the machines get their final id from the start.
     */
    protected targetId(generated: string): string {
        const element = this.targetElement ?? (this.asChild ? resolveAsChild(this.firstElementChild as HTMLElement | null) : this);
        return element?.getAttribute('id') || generated;
    }

    /**
     * Dispatches an event for an option callback (e.g. `onOpenChange`). The event can be canceled with
     * `preventDefault()`, which cancels the change.
     */
    protected emit(type: string, detail: unknown, eventDetails?: { cancel(): void }) {
        const event = new CustomEvent(type, { detail, bubbles: true, cancelable: eventDetails !== undefined });
        if (!this.dispatchEvent(event)) {
            eventDetails?.cancel();
        }
    }

    /**
     * Pushes the options now (instead of on the next microtask).
     */
    protected flushOptions() {
        this.updateScheduled = false;
        if (!this.ready) {
            return;
        }
        // The options of the machines are stores: the effect applying the props follows them.
        batch(() => this.applyOptions());
        this.afterOptions();
    }

    /**
     * Pushes the options again on the next microtask: for values the options read besides the attributes and
     * properties (e.g. the `disabled` state a form gives its controls).
     */
    protected invalidateOptions() {
        if (this.ready && !this.updateScheduled) {
            this.updateScheduled = true;
            queueMicrotask(() => {
                if (this.updateScheduled) {
                    this.flushOptions();
                }
            });
        }
    }

    private setValue(property: string, value: unknown) {
        this.values.set(property, value);
        this.invalidateOptions();
    }

    private isOwnAttribute(name: string) {
        const type = (this.constructor as typeof MachineElement).attributes[name];
        return name === AS_CHILD || (type !== undefined && !isPropertySpec(type));
    }

    private observeTarget() {
        this.childObserver?.disconnect();
        this.childObserver = null;
        if (!this.asChild) {
            this.style.removeProperty('display');
            this.setTarget(this);
            return;
        }
        // The wrapper takes no box of its own.
        this.style.setProperty('display', 'contents');
        const sync = () => {
            const child = resolveAsChild(this.firstElementChild as HTMLElement | null);
            if (process.env.NODE_ENV !== 'production' && this.childElementCount > 1) {
                // biome-ignore lint/suspicious/noConsole: development-only warning.
                console.warn(`<${this.localName} as-child> applies its props to its first child element only.`);
            }
            this.setTarget(child);
        };
        sync();
        this.childObserver = new MutationObserver(sync);
        this.childObserver.observe(this, { childList: true });
    }

    private setTarget(element: HTMLElement | null) {
        const previous = this.targetElement;
        if (previous === element) {
            return;
        }
        this.stopApplying?.();
        this.stopApplying = null;
        if (previous) {
            this.applier.clear(previous);
            this.onTargetRelease(previous);
        }
        this.targetElement = element;
        this.targetHasPageId = element?.hasAttribute('id') ?? false;
        this.onTargetChange(element);
        if (this.ready) {
            this.flushOptions();
        }
        if (this.applying) {
            this.applyToTarget();
        }
    }

    /**
     * Applies the props to the current target in an effect: it re-runs when what the props read changes (the
     * machines' state and options, the element's values).
     */
    private applyToTarget() {
        this.stopApplying?.();
        const element = this.targetElement;
        this.stopApplying = element
            ? effect(() => {
                  const props = this.getProps(element);
                  untracked(() => this.applier.apply(element, props));
              })
            : null;
    }
}

const KEBAB_LETTER = /-([a-z])/g;

function toPropertyName(attribute: string): string {
    return attribute.replace(KEBAB_LETTER, (_match, letter: string) => letter.toUpperCase());
}

/**
 * The element an `as-child` element applies its props to: its child, or, when the child is itself an `as-child`
 * element, the target of that one (e.g. a toolbar button around a toggle around a `<button>`): both apply their props
 * to the same element.
 */
function resolveAsChild(child: HTMLElement | null): HTMLElement | null {
    let element = child;
    while (element instanceof MachineElement && element.asChild) {
        element = element.firstElementChild as HTMLElement | null;
    }
    return element;
}

function isPropertySpec(type: AttributeType | undefined): type is PropertySpec<unknown> {
    return typeof type === 'object' && !Array.isArray(type);
}

function parseAttribute(value: string | null, type: Exclude<AttributeType, PropertySpec<unknown>>): unknown {
    if (value === null) {
        return undefined;
    }
    if (Array.isArray(type)) {
        return type.includes(value) ? value : undefined;
    }
    if (type === 'boolean') {
        return value !== 'false';
    }
    if (type === 'number') {
        const number = Number(value);
        return Number.isNaN(number) ? undefined : number;
    }
    return value;
}
