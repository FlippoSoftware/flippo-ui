// biome-ignore-all lint/security/noSecrets: HTML markup triggers the entropy heuristic.
import { afterEach, describe, expect, it } from 'vitest';

import {
    define,
    getControlSize,
    getTheme,
    persistTheme,
    registerThemes,
    setControlSize,
    setTheme,
    subscribeTheme,
    themeScript
} from '~@src';

import type { ProviderElement } from '~@src';

define({ prefix: 'pv', themes: { sepia: 'light' } });

const flush = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
};

function mount(html: string): HTMLElement {
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.append(root);
    return root;
}

afterEach(() => {
    document.body.replaceChildren();
    setTheme('system');
    setControlSize('medium');
});

describe('theme', () => {
    it('sets the theme of the page on <html>, none for system', () => {
        setTheme('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(getTheme()).toMatchObject({ theme: 'dark', resolvedTheme: 'dark', colorScheme: 'dark' });
        setTheme('system');
        expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(getTheme()).toMatchObject({ theme: 'system', resolvedTheme: 'light', colorScheme: 'light' });
    });

    it('knows the registered themes and tells the subscribers', () => {
        registerThemes({ night: 'dark' });
        const seen: string[] = [];
        const unsubscribe = subscribeTheme((theme) => seen.push(`${theme.resolvedTheme}:${theme.colorScheme}`));
        setTheme('sepia');
        setTheme('night');
        unsubscribe();
        expect(seen).toEqual(['sepia:light', 'night:dark']);
        expect(getTheme().themes).toEqual(['light', 'dark', 'sepia', 'night']);
    });

    it('keeps the theme in localStorage and starts from it (persistTheme, themeScript)', () => {
        localStorage.setItem('pv-theme', 'sepia');
        persistTheme('pv-theme', 'dark');
        expect(getTheme().theme).toBe('sepia');
        setTheme('dark');
        expect(localStorage.getItem('pv-theme')).toBe('dark');
        document.documentElement.removeAttribute('data-theme');
        new Function(themeScript({ storageKey: 'pv-theme' }))();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        localStorage.clear();
    });

    it('gives a provider its own theme, on itself', () => {
        const root = mount('<pv-provider theme="dark"><span id="inside">Inside</span></pv-provider>');
        const provider = root.querySelector('pv-provider') as ProviderElement;
        expect(root.querySelector('#inside')?.closest('[data-theme]')).toBe(provider);
        expect(provider.getAttribute('data-theme')).toBe('dark');
        provider.theme = 'system';
        expect(provider.getAttribute('data-theme')).toBe('light');
        provider.theme = null;
        expect(provider.hasAttribute('data-theme')).toBe(false);
    });
});

describe('control size', () => {
    it('gives the controls the size of the page, then of their provider; an attribute and the defaults win', async () => {
        setControlSize('small');
        const root = mount(`
            <pv-button as-child><button id="page">Page</button></pv-button>
            <pv-provider size="large">
                <pv-button as-child><button id="provider">Provider</button></pv-button>
                <pv-button size="small" as-child><button id="own">Own</button></pv-button>
                <pv-checkbox-label id="label"><pv-checkbox id="box"></pv-checkbox>Agree</pv-checkbox-label>
            </pv-provider>
            <pv-default-props id="defaults"><pv-button as-child><button id="configured">Configured</button></pv-button></pv-default-props>
        `);
        (root.querySelector('#defaults') as ProviderElement).defaults = { button: { size: 'medium' } };
        await flush();
        expect(root.querySelector('#page')?.className).toContain('fl-button--small');
        expect(root.querySelector('#provider')?.className).toContain('fl-button--large');
        expect(root.querySelector('#own')?.className).toContain('fl-button--small');
        expect(root.querySelector('#label')?.className).toContain('fl-choice-label--large');
        expect(root.querySelector('#box')?.className).toContain('fl-checkbox-root--large');
        expect(root.querySelector('#configured')?.className).toContain('fl-button--medium');
    });

    it('follows changes of the page size and of the provider', async () => {
        const root = mount('<pv-provider><pv-button as-child><button id="button">Button</button></pv-button></pv-provider>');
        await flush();
        const button = root.querySelector('#button') as HTMLElement;
        expect(button.className).toContain('fl-button--medium');
        setControlSize('large');
        await flush();
        expect(button.className).toContain('fl-button--large');
        (root.querySelector('pv-provider') as ProviderElement).size = 'small';
        await flush();
        expect(button.className).toContain('fl-button--small');
        expect(getControlSize(button)).toEqual({ size: 'small', height: 40 });
        expect(getControlSize()).toEqual({ size: 'large', height: 56 });
    });

    it('leaves families whose size is not a control size alone', async () => {
        setControlSize('large');
        const root = mount('<pv-spinner id="spinner"></pv-spinner>');
        await flush();
        expect(root.querySelector('#spinner')?.className).toContain('fl-spinner--medium');
    });
});
