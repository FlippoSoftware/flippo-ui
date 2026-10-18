import { join } from 'node:path';

import { compile, compileString } from 'sass';
import { describe, expect, it } from 'vitest';

import * as recipes from '../src/index';
import { CONTROL_FAMILIES, CONTROL_HEIGHTS, CONTROL_SIZES } from '../src/sizes';
import { readStoredTheme, resolveTheme, storeTheme, themeNames, themeScript } from '../src/theme';

const root = join(import.meta.dirname, '..');

describe('sizes', () => {
    it('gives the heights of the --fl-size-* tokens', () => {
        const css = compile(join(root, 'src', 'styles', 'tokens.scss')).css;
        for (const size of CONTROL_SIZES) {
            expect(css).toContain(`--fl-size-${size}: ${CONTROL_HEIGHTS[size]}px;`);
        }
    });

    it('lists families whose recipe has every control size', () => {
        const bySizeOptions = Object.entries(recipes as Record<string, { variantOptions?: Record<string, readonly unknown[]> }>);
        for (const family of CONTROL_FAMILIES) {
            const recipe = bySizeOptions.find(([name]) => name === family || name === `${family}Recipe`)?.[1];
            expect(recipe, family).toBeDefined();
            expect(recipe?.variantOptions?.size, family).toEqual(expect.arrayContaining([...CONTROL_SIZES]));
        }
    });
});

describe('theme', () => {
    it('resolves system to the system scheme', () => {
        expect(resolveTheme('system', {}, 'dark')).toEqual({ theme: 'system', resolvedTheme: 'dark', colorScheme: 'dark' });
    });

    it('gives a registered theme its scheme, an unknown one light', () => {
        expect(resolveTheme('night', { night: 'dark' }, 'light').colorScheme).toBe('dark');
        expect(resolveTheme('dark', {}, 'light').colorScheme).toBe('dark');
        expect(resolveTheme('unknown', {}, 'dark').colorScheme).toBe('light');
    });

    it('lists the built-in themes first', () => {
        expect(themeNames({ sepia: 'light', dark: 'dark' })).toEqual(['light', 'dark', 'sepia']);
    });

    it('writes a theme rule with its scheme, colours and the tokens that read them', () => {
        const css = compileString(
            `@use 'scss' as fl;
            @include fl.theme('sepia', light, $colors: ('bg-1': #f4ecd8, 'text-primary': 'neutral-10'), $primitives: ('brand-40': #7c5cff));`,
            { loadPaths: [root] }
        ).css;
        expect(css).toContain('[data-theme=sepia]');
        expect(css).toContain('color-scheme: light;');
        expect(css).toContain('--fl-color-brand-40: #7c5cff;');
        expect(css).toContain('--fl-color-bg-1: #f4ecd8;');
        expect(css).toContain('--fl-color-text-primary: var(--fl-color-neutral-10);');
        // The semantic colours of the scheme (no light-dark pair) and the shadows are declared again.
        expect(css).toMatch(/--fl-color-brand: var\(--fl-color-brand-40\);/);
        expect(css).toContain('--fl-shadow-popup:');
        expect(css).not.toContain('light-dark(');
    });
});

/** A `localStorage` and a `<html>` of plain objects: the tests of this package run without a DOM. */
function fakePage(stored: Record<string, string> = {}) {
    const attributes = new Map<string, string>();
    const storage = {
        getItem: (key: string) => stored[key] ?? null,
        setItem: (key: string, value: string) => {
            stored[key] = value;
        }
    };
    const document = { documentElement: { setAttribute: (name: string, value: string) => attributes.set(name, value) } };
    const run = (source: string) => new Function('localStorage', 'document', source)(storage, document);
    return { attributes, storage, run };
}

describe('theme script', () => {
    it('puts the stored theme on <html>, none for system', () => {
        const dark = fakePage({ k: 'dark' });
        dark.run(themeScript({ storageKey: 'k' }));
        expect(dark.attributes.get('data-theme')).toBe('dark');

        const none = fakePage();
        none.run(themeScript({ storageKey: 'k' }));
        expect(none.attributes.has('data-theme')).toBe(false);
        none.run(themeScript({ storageKey: 'k', defaultTheme: 'sepia' }));
        expect(none.attributes.get('data-theme')).toBe('sepia');
    });

    it('cannot close its <script> element', () => {
        // biome-ignore lint/security/noSecrets: markup that tries to close the script element, not a secret.
        expect(themeScript({ storageKey: '</script><script>alert(1)' })).not.toContain('</script>');
    });

    it('stores and reads the theme', () => {
        const { storage } = fakePage();
        Object.assign(globalThis, { localStorage: storage });
        storeTheme('night', 'k2');
        expect(readStoredTheme('k2')).toBe('night');
        expect(readStoredTheme('missing')).toBeUndefined();
        Reflect.deleteProperty(globalThis, 'localStorage');
    });
});
