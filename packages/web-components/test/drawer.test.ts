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

describe('drawer', () => {
    it('opens like a dialog, at the edge, and closes', async () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <ui-drawer direction="right">
                <ui-drawer-trigger>Open</ui-drawer-trigger>
                <ui-drawer-backdrop></ui-drawer-backdrop>
                <ui-drawer-popup>
                    <ui-drawer-title>Cart</ui-drawer-title>
                    <ui-drawer-drag>Handle</ui-drawer-drag>
                    <ui-drawer-close>Close</ui-drawer-close>
                </ui-drawer-popup>
            </ui-drawer>`;
        document.body.append(container);
        await tick();
        const query = (selector: string) => container.querySelector(selector) as HTMLElement;
        const popup = query('ui-drawer-popup');

        query('ui-drawer-trigger').click();
        await tick();
        expect(topLayer.has(popup)).toBe(true);
        expect(topLayer.has(query('ui-drawer-backdrop'))).toBe(true);
        expect(popup.getAttribute('role')).toBe('dialog');
        expect(popup.getAttribute('aria-labelledby')).toBe(query('ui-drawer-title').id);
        // Placed by the page's CSS, not centered by the browser.
        expect(popup.getAttribute('data-flippo-top-layer')).toBe('');
        expect(popup.hasAttribute('data-swipe-direction-right')).toBe(true);

        query('ui-drawer-close').click();
        await tick();
        expect(topLayer.has(popup)).toBe(false);
    });
});
