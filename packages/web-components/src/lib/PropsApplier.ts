import type { Props } from '@flippo-software/core-components/props';

type Handler = (event: Event) => void;

/**
 * What one `apply` call applied.
 */
type Applied = {
    attributes: Set<string>;
    listeners: Set<string>;
    classTokens: string[];
    style: Record<string, unknown> | undefined;
};

type AppliedListener = {
    handler: Handler;
    readonly listener: (event: Event) => void;
    readonly type: string;
    readonly capture: boolean;
};

/**
 * React prop names that differ from the attribute names.
 */
const ATTRIBUTE_NAMES: Record<string, string> = {
    className: 'class',
    htmlFor: 'for',
    tabIndex: 'tabindex',
    readOnly: 'readonly',
    autoComplete: 'autocomplete',
    autoFocus: 'autofocus',
    spellCheck: 'spellcheck',
    maxLength: 'maxlength',
    minLength: 'minlength',
    inputMode: 'inputmode',
    enterKeyHint: 'enterkeyhint',
    contentEditable: 'contenteditable',
    crossOrigin: 'crossorigin',
    // The initial value of a form control is its attribute (React's uncontrolled `defaultValue`).
    defaultValue: 'value',
    defaultChecked: 'checked'
};

/**
 * Props that are the current state of a form control (React's controlled `value` and `checked`): the DOM property,
 * not the attribute (which is the initial state).
 */
const CONTROL_PROPERTIES = new Set(['value', 'checked']);

function isFormControl(element: HTMLElement): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
    const name = element.localName;
    return name === 'input' || name === 'textarea' || name === 'select';
}

/**
 * React event props whose DOM event has another name or other semantics. The core handlers are written for React:
 * its `onFocus`/`onBlur` bubble (`focusin`/`focusout`), and its `onChange` fires on every input.
 */
const EVENT_TYPES: Record<string, string> = {
    focus: 'focusin',
    blur: 'focusout',
    change: 'input',
    doubleclick: 'dblclick'
};

/**
 * React adds `px` to numbers, except for these properties.
 */
const UNITLESS_STYLES = new Set(['opacity', 'zIndex', 'flex', 'flexGrow', 'flexShrink', 'order', 'lineHeight', 'fontWeight', 'zoom']);

// biome-ignore lint/security/noSecrets: prop names, not secrets.
const IGNORED_PROPS = new Set(['children', 'ref', 'key', 'dangerouslySetInnerHTML', 'suppressHydrationWarning']);

const WHITESPACE = /\s+/;

const UPPERCASE_LETTER = /[A-Z]/g;

/**
 * `onClick`, `onKeyDownCapture`…: `on` followed by an uppercase letter.
 */
function isEventProp(key: string): boolean {
    return key.length > 2 && key.startsWith('on') && key[2] === key[2]?.toUpperCase();
}

/**
 * Applies props returned by the core prop getters (React-shaped: `onClick`, `tabIndex`, `style` objects…) to a DOM
 * element, and removes what an earlier call applied and the new props no longer have.
 *
 * Attributes the element owns (e.g. the options of a custom element, like its `disabled` attribute) are never
 * written: pass them as `isOwnedAttribute`.
 */
export class PropsApplier {
    private readonly attributes = new Set<string>();

    private readonly classTokens = new Set<string>();

    private readonly styles = new Set<string>();

    private readonly listeners = new Map<string, AppliedListener>();

    private readonly isOwnedAttribute: (name: string) => boolean;

    constructor(isOwnedAttribute: (name: string) => boolean = () => false) {
        this.isOwnedAttribute = isOwnedAttribute;
    }

    apply(element: HTMLElement, props: Props) {
        const applied: Applied = { attributes: new Set(), listeners: new Set(), classTokens: [], style: undefined };
        for (const [key, value] of Object.entries(props)) {
            this.applyProp(element, key, value, applied);
        }
        const { attributes, listeners, classTokens, style } = applied;
        this.removeStaleAttributes(element, attributes);
        this.removeStaleListeners(element, listeners);
        this.applyClass(element, classTokens);
        this.applyStyle(element, style);
    }

    /**
     * Removes everything applied to `element`.
     */
    clear(element: HTMLElement) {
        this.apply(element, {});
    }

    private applyProp(element: HTMLElement, key: string, value: unknown, applied: Applied) {
        if (IGNORED_PROPS.has(key)) {
            return;
        }
        if (key === 'style') {
            applied.style = (value ?? undefined) as Record<string, unknown> | undefined;
        } else if (key === 'className' || key === 'class') {
            applied.classTokens = typeof value === 'string' ? value.split(WHITESPACE).filter(Boolean) : [];
        } else if (CONTROL_PROPERTIES.has(key) && isFormControl(element)) {
            this.setControlProperty(element, key as 'value' | 'checked', value);
        } else if (isEventProp(key)) {
            if (typeof value === 'function') {
                applied.listeners.add(this.listen(element, key, value as Handler));
            }
        } else {
            this.setAttribute(element, key, value, applied.attributes);
        }
    }

    private setAttribute(element: HTMLElement, key: string, value: unknown, applied: Set<string>) {
        const name = ATTRIBUTE_NAMES[key] ?? key;
        if (this.isOwnedAttribute(name)) {
            return;
        }
        const attribute = toAttributeValue(name, value);
        if (attribute === null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, attribute);
            applied.add(name);
        }
    }

    private setControlProperty(
        element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
        key: 'value' | 'checked',
        value: unknown
    ) {
        if (value === undefined || value === null) {
            return;
        }
        if (key === 'checked') {
            if ('checked' in element && element.checked !== Boolean(value)) {
                element.checked = Boolean(value);
            }
        } else if (element.value !== String(value)) {
            element.value = String(value);
        }
    }

    private removeStaleAttributes(element: HTMLElement, applied: Set<string>) {
        for (const name of this.attributes) {
            if (!applied.has(name)) {
                element.removeAttribute(name);
            }
        }
        this.attributes.clear();
        for (const name of applied) {
            this.attributes.add(name);
        }
    }

    private removeStaleListeners(element: HTMLElement, applied: Set<string>) {
        for (const [key, listener] of this.listeners) {
            if (!applied.has(key)) {
                element.removeEventListener(listener.type, listener.listener, listener.capture);
                this.listeners.delete(key);
            }
        }
    }

    private listen(element: HTMLElement, key: string, handler: Handler): string {
        const capture = key.endsWith('Capture');
        const name = key.slice(2, capture ? -'Capture'.length : undefined).toLowerCase();
        const type = EVENT_TYPES[name] ?? name;
        const id = `${type}:${capture}`;

        const applied = this.listeners.get(id);
        if (applied) {
            // The same listener stays registered: only the handler it calls changes.
            applied.handler = handler;
            return id;
        }
        const created: AppliedListener = {
            handler,
            listener: (event) => created.handler(event),
            type,
            capture
        };
        element.addEventListener(type, created.listener, capture);
        this.listeners.set(id, created);
        return id;
    }

    private applyClass(element: HTMLElement, tokens: string[]) {
        for (const token of this.classTokens) {
            if (!tokens.includes(token)) {
                element.classList.remove(token);
            }
        }
        this.classTokens.clear();
        for (const token of tokens) {
            element.classList.add(token);
            this.classTokens.add(token);
        }
    }

    private applyStyle(element: HTMLElement, style: Record<string, unknown> | undefined) {
        const applied = new Set<string>();
        for (const [key, value] of Object.entries(style ?? {})) {
            const property = key.startsWith('--') ? key : key.replace(UPPERCASE_LETTER, (letter) => `-${letter.toLowerCase()}`);
            if (value == null || value === '') {
                element.style.removeProperty(property);
                continue;
            }
            const text =
                typeof value === 'number' && value !== 0 && !key.startsWith('--') && !UNITLESS_STYLES.has(key)
                    ? `${value}px`
                    : String(value);
            element.style.setProperty(property, text);
            applied.add(property);
        }
        for (const property of this.styles) {
            if (!applied.has(property)) {
                element.style.removeProperty(property);
            }
        }
        this.styles.clear();
        for (const property of applied) {
            this.styles.add(property);
        }
    }
}

/**
 * The attribute value React would render, or `null` to remove the attribute.
 */
function toAttributeValue(name: string, value: unknown): string | null {
    if (value == null) {
        return null;
    }
    // React stringifies booleans of ARIA and data attributes (`aria-expanded="false"`).
    if (name.startsWith('aria-') || name.startsWith('data-')) {
        return String(value);
    }
    if (value === false) {
        return null;
    }
    if (value === true) {
        return '';
    }
    return String(value);
}
