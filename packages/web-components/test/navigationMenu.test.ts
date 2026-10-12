import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { define } from '../src';

import { stubPopoverApi } from './stubPopoverApi';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { topLayer, restore } = stubPopoverApi();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(restore);

afterEach(() => {
    document.body.innerHTML = '';
    topLayer.clear();
});

async function until(condition: () => boolean) {
    for (let i = 0; i < 20 && !condition(); i++) {
        await tick();
    }
}

describe('navigation menu', () => {
    it('opens the content of an item next to its trigger, in place', async () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <ui-navigation-menu>
                <ui-navigation-menu-list>
                    <ui-navigation-menu-item value="products">
                        <ui-navigation-menu-trigger id="products">Products<ui-navigation-menu-icon></ui-navigation-menu-icon></ui-navigation-menu-trigger>
                        <ui-navigation-menu-content id="products-content">
                            <ui-navigation-menu-link as-child><a href="#a">A</a></ui-navigation-menu-link>
                        </ui-navigation-menu-content>
                    </ui-navigation-menu-item>
                    <ui-navigation-menu-item value="docs">
                        <ui-navigation-menu-trigger id="docs">Docs</ui-navigation-menu-trigger>
                        <ui-navigation-menu-content id="docs-content">Docs</ui-navigation-menu-content>
                    </ui-navigation-menu-item>
                    <ui-navigation-menu-item>
                        <ui-navigation-menu-link id="blog" as-child><a href="#blog">Blog</a></ui-navigation-menu-link>
                    </ui-navigation-menu-item>
                </ui-navigation-menu-list>
            </ui-navigation-menu>`;
        document.body.append(container);
        await tick();
        await tick();
        const query = (selector: string) => container.querySelector(selector) as HTMLElement;
        const content = query('#products-content');
        expect(content.hidden).toBe(true);
        expect(query('#products').getAttribute('aria-expanded')).toBe('false');

        query('#products').click();
        await until(() => topLayer.has(content));
        expect(topLayer.has(content)).toBe(true);
        expect(content.hidden).toBe(false);
        expect(query('#products').getAttribute('aria-expanded')).toBe('true');
        expect(query('#products').hasAttribute('data-popup-open')).toBe(true);
        expect(query('ui-navigation-menu').hasAttribute('data-open')).toBe(true);
        // Still in its item: nothing is moved.
        expect(content.parentElement?.getAttribute('value')).toBe('products');

        query('#docs').click();
        await until(() => topLayer.has(query('#docs-content')));
        expect(topLayer.has(query('#docs-content'))).toBe(true);
        await until(() => !topLayer.has(content));
        expect(topLayer.has(content)).toBe(false);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await until(() => !topLayer.has(query('#docs-content')));
        expect(topLayer.has(query('#docs-content'))).toBe(false);
    });
});
