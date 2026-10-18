import { CONTROL_FAMILIES, controlHeight, DEFAULT_CONTROL_SIZE, isControlSize } from '@flippo-software/component-styles/sizes';
import {
    readStoredTheme,
    resolveTheme,
    storeTheme,
    subscribeSystemColorScheme,
    systemColorScheme,
    THEME_ATTRIBUTE,
    themeNames
} from '@flippo-software/component-styles/theme';
import { Store } from '@flippo-software/store';

import type { ControlSize } from '@flippo-software/component-styles/sizes';
import type { ColorScheme, ResolvedTheme, ThemeName, ThemeSetting, Themes } from '@flippo-software/component-styles/theme';

import { DefaultPropsElement } from './defaultProps';

type GlobalState = { theme: ThemeSetting; themes: Themes; size: ControlSize; system: ColorScheme };

const global = new Store<GlobalState>({ theme: 'system', themes: {}, size: DEFAULT_CONTROL_SIZE, system: 'light' });

let systemWatched = false;

/** Starts following the system's colour scheme, on the first use (no DOM access when the module loads). */
function watchSystem(): void {
    if (systemWatched) return;
    systemWatched = true;
    global.set('system', systemColorScheme());
    subscribeSystemColorScheme((scheme) => global.set('system', scheme));
}

export type ThemeState = ResolvedTheme & { readonly themes: readonly ThemeName[] };

function current(): ThemeState {
    const { theme, themes, system } = global.state;
    return { ...resolveTheme(theme, themes, system), themes: themeNames(themes) };
}

/**
 * Sets the theme of the page: `system`, `light`, `dark` or a registered one, on `<html>` (`system` removes the
 * attribute and lets the stylesheet follow the system). `<prefix>-provider theme="…"` sets a part's own.
 */
export function setTheme(theme: ThemeSetting): void {
    watchSystem();
    global.set('theme', theme);
    if (storageKey !== undefined) storeTheme(theme, storageKey);
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute(THEME_ATTRIBUTE);
    else root.setAttribute(THEME_ATTRIBUTE, theme);
}

let storageKey: string | undefined;

/**
 * Keeps the theme set with `setTheme` in `localStorage` under `key`, and applies the stored one (else `fallback`).
 * Inline `themeScript({ storageKey: key })` in the `<head>` too, so the page shows it before its scripts run.
 */
export function persistTheme(key: string, fallback?: ThemeSetting): void {
    storageKey = key;
    const theme = readStoredTheme(key) ?? fallback;
    if (theme !== undefined) setTheme(theme);
}

/**
 * Registers the application's own themes, by name, with the colour scheme each is built on: `{ sepia: 'light' }`.
 * Their styles are `[data-theme='<name>']` rules (the `fl.theme` SCSS mixin).
 */
export function registerThemes(themes: Themes): void {
    global.set('themes', { ...global.state.themes, ...themes });
}

/** The theme of the page: the one asked for, the one in effect, its colour scheme and the available themes. */
export function getTheme(): ThemeState {
    watchSystem();
    return current();
}

/** Calls `listener` with the theme of the page when it changes (or the system's scheme, for `system`). */
export function subscribeTheme(listener: (theme: ThemeState) => void): () => void {
    watchSystem();
    let previous = current();
    return global.subscribe(() => {
        const next = current();
        if (
            next.theme !== previous.theme ||
            next.resolvedTheme !== previous.resolvedTheme ||
            next.themes.length !== previous.themes.length
        ) {
            previous = next;
            listener(next);
        }
    });
}

/** Sets the control size of the page: the elements with a control size take it unless theirs is set. */
export function setControlSize(size: ControlSize): void {
    global.set('size', size);
}

export type ControlSizeState = { readonly size: ControlSize; readonly height: number };

/** The control size of `element`'s subtree (its closest `<prefix>-provider size`, else the page's) and its height. */
export function getControlSize(element?: Element): ControlSizeState {
    const size = (element && providerSize(element)) ?? global.state.size;
    return { size, height: controlHeight(size) };
}

/** The number of connected providers: while there is none, an element reads the page's size only. */
const providers = new Store<{ count: number }>({ count: 0 });

/**
 * The theme and the control size of its subtree, and its default props (`defaults`, as `<prefix>-default-props`):
 * `<ui-provider theme="dark" size="small">`. It renders as `display: contents`; the popups of its elements, in the top
 * layer, stay in its subtree and keep its theme.
 */
export class ProviderElement extends DefaultPropsElement {
    static observedAttributes = ['theme', 'size'];

    private readonly own = new Store<{ theme: ThemeSetting | null; size: ControlSize | null }>({ theme: null, size: null });
    private unsubscribe: (() => void) | undefined;

    get theme(): ThemeSetting | null {
        return this.own.state.theme;
    }

    set theme(theme: ThemeSetting | null) {
        if (theme === null) this.removeAttribute('theme');
        else this.setAttribute('theme', theme);
    }

    get size(): ControlSize | null {
        return this.own.state.size;
    }

    set size(size: ControlSize | null) {
        if (size === null) this.removeAttribute('size');
        else this.setAttribute('size', size);
    }

    attributeChangedCallback(name: string, _previous: string | null, value: string | null) {
        if (name === 'theme') {
            this.own.set('theme', value);
            this.applyTheme();
        } else if (name === 'size') {
            this.own.set('size', isControlSize(value) ? value : null);
        }
    }

    override connectedCallback() {
        super.connectedCallback();
        providers.set('count', providers.state.count + 1);
        watchSystem();
        this.unsubscribe = global.subscribe(() => this.applyTheme());
        this.applyTheme();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        providers.set('count', providers.state.count - 1);
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    /** The theme in effect in its subtree (`system` resolved), or `null` without a `theme`. */
    get resolvedTheme(): ThemeName | null {
        const { theme } = this.own.state;
        return theme === null ? null : resolveTheme(theme, global.state.themes, global.state.system).resolvedTheme;
    }

    private applyTheme() {
        const theme = this.resolvedTheme;
        if (theme === null) this.removeAttribute(THEME_ATTRIBUTE);
        else this.setAttribute(THEME_ATTRIBUTE, theme);
    }
}

function parent(element: Element): Element | null {
    return element.parentElement ?? (element.getRootNode() as ShadowRoot).host ?? null;
}

function providerSize(element: Element): ControlSize | undefined {
    if (providers.state.count === 0) return undefined;
    for (let ancestor = parent(element); ancestor; ancestor = parent(ancestor)) {
        if (ancestor instanceof ProviderElement && ancestor.size !== null) return ancestor.size;
    }
    return undefined;
}

/**
 * The size an element of a control family falls back to: its closest provider's, else the page's. Reads are tracked:
 * the elements update when it changes. Other families get none.
 */
export function fallbackSize(element: Element, family: string): ControlSize | undefined {
    const key = family.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return CONTROL_FAMILIES.has(key) ? (providerSize(element) ?? global.state.size) : undefined;
}
