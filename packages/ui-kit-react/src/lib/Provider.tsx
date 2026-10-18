'use client';
import * as React from 'react';

import { CONTROL_FAMILIES, controlHeight, DEFAULT_CONTROL_SIZE, isControlSize } from '@flippo-software/component-styles/sizes';
import {
    readStoredTheme,
    resolveTheme,
    storeTheme,
    subscribeSystemColorScheme,
    systemColorScheme,
    THEME_ATTRIBUTE,
    themeNames,
    themeScript
} from '@flippo-software/component-styles/theme';

import type { ControlSize } from '@flippo-software/component-styles/sizes';
import type { ColorScheme, ThemeName, ThemeScriptOptions, ThemeSetting, Themes } from '@flippo-software/component-styles/theme';

import { DefaultPropsProvider, useConfiguredProps } from './DefaultProps';

import type { DefaultProps } from './DefaultProps';

type ProviderValue = {
    readonly theme: ThemeSetting;
    readonly resolvedTheme: ThemeName;
    readonly colorScheme: ColorScheme;
    readonly themes: readonly ThemeName[];
    readonly setTheme: (theme: ThemeSetting) => void;
    readonly size: ControlSize;
    /** The theme is set on a wrapper of the provider's children, not on `<html>`: portals carry it too. */
    readonly scoped: boolean;
    /** The registered themes with their schemes, the outer providers' included. */
    readonly registry: Themes;
};

const ProviderContext = React.createContext<ProviderValue | null>(null);

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useSystemColorScheme(): ColorScheme {
    return React.useSyncExternalStore(subscribeSystemColorScheme, systemColorScheme, () => 'light');
}

export type FlippoProviderProps = {
    /** The theme (controlled): `system`, `light`, `dark` or one of `themes`. */
    theme?: ThemeSetting;
    /** The initial theme (uncontrolled). @default 'system', or the outer provider's theme */
    defaultTheme?: ThemeSetting;
    /** Called when `setTheme` of `useTheme()` asks for another theme. */
    onThemeChange?: (theme: ThemeSetting) => void;
    /**
     * Keeps the theme chosen with `setTheme` in `localStorage` under this key and starts from it. Render
     * `<ThemeScript storageKey={…} />` in the `<head>` with the same key, so the page shows it before the first paint.
     */
    storageKey?: string;
    /**
     * The application's own themes, by name, with the colour scheme each is built on: `{ sepia: 'light' }`. Their
     * styles are `[data-theme='<name>']` rules (the `fl.theme` SCSS mixin). Nested providers add to the outer ones.
     */
    themes?: Themes;
    /** The control size of the subtree: the components with a control size take it unless theirs is set. */
    size?: ControlSize;
    /** Default props of the components (`DefaultPropsProvider`). */
    defaults?: DefaultProps;
    /**
     * Sets the theme on a wrapper (`display: contents`) instead of `<html>`, for a part of the page in another theme.
     * The popups of the kit, rendered in portals, follow it. A provider inside another one with a theme of its own is
     * always scoped. @default false
     */
    scoped?: boolean;
    children?: React.ReactNode;
};

/**
 * The theme and the control size of the application, or of a part of it, and its default props. `useTheme()` reads and
 * changes the theme, `useControlSize()` reads the size grid.
 *
 * @example
 * <FlippoProvider theme={theme} onThemeChange={setTheme} themes={{ sepia: 'light' }} size="small">
 */
export function FlippoProvider(props: FlippoProviderProps): React.JSX.Element {
    const { theme: controlled, defaultTheme, onThemeChange, storageKey, themes, size, defaults, children } = props;
    const parent = React.useContext(ProviderContext);
    const [uncontrolled, setUncontrolled] = React.useState(defaultTheme ?? (storageKey === undefined ? undefined : 'system'));
    // The stored theme is read after hydration (the server does not know it), before the first paint.
    const [restored, setRestored] = React.useState(storageKey === undefined);
    const own = controlled ?? uncontrolled;
    // A provider without a theme of its own (one that sets a size, say) leaves the theme alone: it keeps the outer
    // provider's, or the page's, until `setTheme` gives it one.
    const inherits = own === undefined;
    const theme = own ?? parent?.theme ?? 'system';
    const scoped = inherits ? (parent?.scoped ?? false) : parent !== null || props.scoped === true;
    const system = useSystemColorScheme();

    const registered = React.useMemo(() => ({ ...parent?.registry, ...themes }), [parent, themes]);
    const onChange = React.useRef(onThemeChange);
    onChange.current = onThemeChange;
    const key = React.useRef(storageKey);
    key.current = storageKey;
    const setOwnTheme = React.useCallback((next: ThemeSetting) => {
        setUncontrolled(next);
        if (key.current !== undefined) storeTheme(next, key.current);
        onChange.current?.(next);
    }, []);

    useIsoLayoutEffect(() => {
        if (restored) return;
        const stored = controlled === undefined && storageKey !== undefined ? readStoredTheme(storageKey) : undefined;
        if (stored) setUncontrolled(stored);
        setRestored(true);
    }, [restored, controlled, storageKey]);
    const setTheme = inherits && parent ? parent.setTheme : setOwnTheme;

    const value = React.useMemo<ProviderValue>(
        () => ({
            ...resolveTheme(theme, registered, system),
            themes: themeNames(registered),
            setTheme,
            size: size ?? parent?.size ?? DEFAULT_CONTROL_SIZE,
            scoped,
            registry: registered
        }),
        [theme, registered, system, setTheme, size, parent, scoped]
    );

    // The outermost provider puts the theme on `<html>`, so the page and the portals follow it; `system` leaves the
    // attribute off and lets the stylesheet follow the system.
    const onRoot = parent === null && !scoped && !inherits;
    const attribute = theme === 'system' ? null : value.resolvedTheme;
    useIsoLayoutEffect(() => {
        if (!(onRoot && restored)) return;
        const root = document.documentElement;
        const previous = root.getAttribute(THEME_ATTRIBUTE);
        if (attribute === null) root.removeAttribute(THEME_ATTRIBUTE);
        else root.setAttribute(THEME_ATTRIBUTE, attribute);
        return () => {
            if (previous === null) root.removeAttribute(THEME_ATTRIBUTE);
            else root.setAttribute(THEME_ATTRIBUTE, previous);
        };
    }, [onRoot, restored, attribute]);

    let content = children;
    if (defaults) content = <DefaultPropsProvider defaults={defaults}>{content}</DefaultPropsProvider>;
    if (scoped && !inherits) content = <ThemeWrapper theme={value.resolvedTheme}>{content}</ThemeWrapper>;
    return <ProviderContext.Provider value={value}>{content}</ProviderContext.Provider>;
}

function ThemeWrapper({ theme, children }: { theme: ThemeName; children?: React.ReactNode }) {
    return (
        <div data-theme={theme} style={{ display: 'contents' }}>
            {children}
        </div>
    );
}

export type ThemeState = Omit<ProviderValue, 'size' | 'scoped' | 'registry'>;

const NO_PROVIDER_THEMES = themeNames({});

/**
 * The theme: the one asked for (`theme`, `system` included), the one in effect (`resolvedTheme`), its colour scheme,
 * the available themes and `setTheme`. Outside a `FlippoProvider` it follows the system, and `setTheme` does nothing.
 */
export function useTheme(): ThemeState {
    const value = React.useContext(ProviderContext);
    const system = useSystemColorScheme();
    return React.useMemo(() => {
        if (value) {
            const { size: _size, scoped: _scoped, registry: _registry, ...theme } = value;
            return theme;
        }
        return { ...resolveTheme('system', {}, system), themes: NO_PROVIDER_THEMES, setTheme: () => {} };
    }, [value, system]);
}

export type ControlSizeState = {
    /** The control size. */
    readonly size: ControlSize;
    /** The height of a row of controls of that size, in pixels. */
    readonly height: number;
};

/**
 * The control size of the subtree and the height of its controls (`FlippoProvider size`). With a family (`select`,
 * `checkbox`), the size that family takes — its default props, else the subtree's — and the subtree's as `global`.
 *
 * @example
 * const { size, height } = useControlSize(); // 'medium', 48
 * const { size, global } = useControlSize('button');
 */
export function useControlSize(): ControlSizeState;
export function useControlSize(family: string): ControlSizeState & { readonly global: ControlSizeState };
export function useControlSize(family?: string): ControlSizeState & { readonly global?: ControlSizeState } {
    const globalSize = React.useContext(ProviderContext)?.size ?? DEFAULT_CONTROL_SIZE;
    const configured = useConfiguredProps(family ?? '', undefined).family?.size;
    return React.useMemo(() => {
        const global = { size: globalSize, height: controlHeight(globalSize) };
        if (family === undefined) return global;
        const size = CONTROL_FAMILIES.has(family) && isControlSize(configured) ? configured : globalSize;
        return { size, height: controlHeight(size), global };
    }, [family, configured, globalSize]);
}

/** The control size the styled parts of a control family fall back to (none for other families). */
export function useFallbackSize(family: string): ControlSize | undefined {
    const size = React.useContext(ProviderContext)?.size ?? DEFAULT_CONTROL_SIZE;
    return CONTROL_FAMILIES.has(family) ? size : undefined;
}

/**
 * A portal of the kit: in a scoped provider its content keeps the provider's theme, as it leaves the provider's
 * element for `<body>`.
 */
export function themedPortal<P extends { children?: React.ReactNode }>(Portal: React.ComponentType<P>): React.ComponentType<P> {
    function ThemedPortal(props: P) {
        const value = React.useContext(ProviderContext);
        if (!value?.scoped) return <Portal {...props} />;
        return (
            <Portal {...props}>
                <ThemeWrapper theme={value.resolvedTheme}>{props.children}</ThemeWrapper>
            </Portal>
        );
    }
    ThemedPortal.displayName = `Themed(${Portal.displayName ?? 'Portal'})`;
    return ThemedPortal;
}

/**
 * An inline `<script>` for the `<head>`: it puts the stored theme on `<html>` before the first paint, so a page
 * rendered on the server shows the chosen theme at once instead of flashing the system's. Give it the provider's
 * `storageKey` (and `defaultTheme`); `nonce` for a Content Security Policy.
 */
export function ThemeScript({ nonce, ...options }: ThemeScriptOptions & { nonce?: string }): React.JSX.Element {
    return (
        <script
            nonce={nonce}
            suppressHydrationWarning={true}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: the script is built by `themeScript`, which escapes its values.
            dangerouslySetInnerHTML={{ __html: themeScript(options) }}
        />
    );
}
