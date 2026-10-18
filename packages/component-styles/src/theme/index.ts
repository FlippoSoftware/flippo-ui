/**
 * Themes, for the providers of the styled packages and for code that needs to know the theme. A theme is a
 * `[data-theme='<name>']` rule of the stylesheets: `light` and `dark` are built in, an application adds its own with
 * the `fl.theme` SCSS mixin (or plain CSS) and registers its name and colour scheme here, through the providers.
 *
 * No module-level DOM access: the system scheme is read when asked, and is `light` without a DOM (server rendering).
 */

export type ColorScheme = 'light' | 'dark';

/** A theme's name: `light`, `dark` or a registered one. */
export type ThemeName = 'light' | 'dark' | (string & {});

/** The theme an application asks for: a theme, or `system` to follow the system's colour scheme. */
export type ThemeSetting = ThemeName | 'system';

/** Registered themes: a theme's name and the colour scheme it is built on (native controls, scrollbars, `light-dark()`). */
export type Themes = Readonly<Record<string, ColorScheme>>;

/** The built-in themes. */
export const BUILT_IN_THEMES: Themes = { light: 'light', dark: 'dark' };

/** The attribute that selects the theme of an element and its subtree. */
export const THEME_ATTRIBUTE = 'data-theme';

const QUERY = '(prefers-color-scheme: dark)';

function media(): MediaQueryList | undefined {
    return typeof window === 'undefined' || typeof window.matchMedia !== 'function' ? undefined : window.matchMedia(QUERY);
}

/** The colour scheme of the system; `light` without a DOM. */
export function systemColorScheme(): ColorScheme {
    return media()?.matches ? 'dark' : 'light';
}

/** Calls `listener` when the system's colour scheme changes; returns the unsubscribe function. */
export function subscribeSystemColorScheme(listener: (scheme: ColorScheme) => void): () => void {
    const query = media();
    if (!query) {
        return () => {};
    }
    const onChange = () => listener(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}

export type ResolvedTheme = {
    /** The theme asked for, `system` included. */
    readonly theme: ThemeSetting;
    /** The theme in effect: `system` resolved to `light` or `dark`. */
    readonly resolvedTheme: ThemeName;
    /** The colour scheme of the theme in effect. */
    readonly colorScheme: ColorScheme;
};

/**
 * Resolves a theme setting: `system` becomes the system's scheme; a theme takes the scheme it is registered with
 * (an unregistered name is a light theme).
 */
export function resolveTheme(theme: ThemeSetting, themes: Themes, system: ColorScheme): ResolvedTheme {
    if (theme === 'system') {
        return { theme, resolvedTheme: system, colorScheme: system };
    }
    return { theme, resolvedTheme: theme, colorScheme: themes[theme] ?? BUILT_IN_THEMES[theme] ?? 'light' };
}

/** All the theme names: the built-in ones, then the registered ones. */
export function themeNames(themes: Themes): readonly ThemeName[] {
    return [...new Set([...Object.keys(BUILT_IN_THEMES), ...Object.keys(themes)])];
}

/** The `localStorage` key of the stored theme, unless the providers are given another. */
export const DEFAULT_THEME_STORAGE_KEY = 'flippo-theme';

/** The stored theme, if any (none without `localStorage`, or when it is blocked). */
export function readStoredTheme(storageKey: string = DEFAULT_THEME_STORAGE_KEY): ThemeSetting | undefined {
    try {
        return globalThis.localStorage?.getItem(storageKey) ?? undefined;
    } catch {
        return undefined;
    }
}

/** Stores the theme; a blocked `localStorage` is ignored. */
export function storeTheme(theme: ThemeSetting, storageKey: string = DEFAULT_THEME_STORAGE_KEY): void {
    try {
        globalThis.localStorage?.setItem(storageKey, theme);
    } catch {
        // The choice is kept for this page only.
    }
}

/** JSON for a script: `<` escaped, so a value cannot close the `<script>` element. */
function scriptValue(value: string): string {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}

export type ThemeScriptOptions = {
    /** The `localStorage` key of the stored theme. @default 'flippo-theme' */
    storageKey?: string;
    /** The theme without a stored one. @default 'system' */
    defaultTheme?: ThemeSetting;
};

/**
 * The source of an inline `<script>` for the `<head>`: it puts the stored theme on `<html>` before the first paint,
 * so a page rendered on the server, or before its scripts run, shows the chosen theme at once instead of flashing the
 * system's. Use it with the same `storageKey` as the provider.
 */
export function themeScript({ storageKey = DEFAULT_THEME_STORAGE_KEY, defaultTheme = 'system' }: ThemeScriptOptions = {}): string {
    return (
        `(function(){var t;try{t=localStorage.getItem(${scriptValue(storageKey)})}catch(e){}` +
        `t=t||${scriptValue(defaultTheme)};` +
        `if(t!=="system")document.documentElement.setAttribute(${scriptValue(THEME_ATTRIBUTE)},t)})()`
    );
}
