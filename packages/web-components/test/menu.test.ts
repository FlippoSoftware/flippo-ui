import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { stubPopoverApi } from './stubPopoverApi';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { topLayer, showPopover, restore } = stubPopoverApi();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(restore);

afterEach(() => {
    document.body.innerHTML = '';
    topLayer.clear();
    showPopover.mockClear();
});

/**
 * Waits until `condition` holds (the focus moves in an animation frame).
 */
async function until(condition: () => boolean) {
    for (let i = 0; i < 20 && !condition(); i++) {
        await tick();
    }
}

const key = (element: Element, value: string) =>
    element.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, composed: true, cancelable: true }));

function mount(rootAttributes = '') {
    const container = document.createElement('div');
    container.innerHTML = `
        <ui-menu ${rootAttributes}>
            <ui-menu-trigger as-child><button type="button">Actions</button></ui-menu-trigger>
            <ui-menu-positioner>
                <ui-menu-popup>
                    <ui-menu-item id="copy">Copy</ui-menu-item>
                    <ui-menu-item id="paste" disabled>Paste</ui-menu-item>
                    <ui-menu-checkbox-item id="wrap">
                        <ui-menu-item-indicator id="wrap-indicator">✓</ui-menu-item-indicator>Wrap
                    </ui-menu-checkbox-item>
                    <ui-menu-group id="group">
                        <ui-menu-group-label id="group-label">Sort</ui-menu-group-label>
                        <ui-menu-radio-group default-value="name">
                            <ui-menu-radio-item id="by-name" value="name">Name</ui-menu-radio-item>
                            <ui-menu-radio-item id="by-date" value="date">Date</ui-menu-radio-item>
                        </ui-menu-radio-group>
                    </ui-menu-group>
                    <ui-menu-submenu>
                        <ui-menu-submenu-trigger id="more">More</ui-menu-submenu-trigger>
                        <ui-menu-positioner id="sub-positioner">
                            <ui-menu-popup>
                                <ui-menu-item id="export">Export</ui-menu-item>
                            </ui-menu-popup>
                        </ui-menu-positioner>
                    </ui-menu-submenu>
                </ui-menu-popup>
            </ui-menu-positioner>
        </ui-menu>
        <button id="outside">Outside</button>`;
    document.body.append(container);
    const query = (selector: string) => container.querySelector(selector) as HTMLElement;
    return {
        root: query('ui-menu'),
        button: query('button'),
        positioner: query('ui-menu-positioner'),
        popup: query('ui-menu-popup'),
        query
    };
}

async function open() {
    const menu = mount();
    await tick();
    menu.button.click();
    await tick();
    return menu;
}

describe('menu', () => {
    it('opens with the trigger into the top layer', async () => {
        const { button, positioner, popup, query } = await open();
        expect(topLayer.has(positioner)).toBe(true);
        expect(button.getAttribute('aria-haspopup')).toBe('menu');
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(popup.getAttribute('role')).toBe('menu');
        expect(query('#copy').getAttribute('role')).toBe('menuitem');
        expect(query('#paste').getAttribute('aria-disabled')).toBe('true');
        expect(query('#paste').hasAttribute('data-disabled')).toBe(true);
    });

    it('closes when an item is pressed, and lets the page handle the click', async () => {
        const { root, positioner, query } = await open();
        const onClick = vi.fn();
        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        query('#copy').addEventListener('click', onClick);
        root.addEventListener('open-change', onChange);

        query('#copy').click();
        await tick();
        expect(onClick).toHaveBeenCalledOnce();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ open: false, reason: 'item-press' }));
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('opens with the keyboard on the first item, and moves with the arrow keys', async () => {
        const { button, popup, query } = mount();
        await tick();
        button.focus();
        key(button, 'ArrowDown');
        await tick();
        await tick();
        const highlighted = () => popup.querySelector('[data-highlighted]')?.id;
        expect(highlighted()).toBe('copy');
        key(popup, 'ArrowDown');
        await tick();
        // Disabled items stay focusable.
        expect(highlighted()).toBe('paste');
        key(popup, 'ArrowDown');
        await tick();
        expect(highlighted()).toBe('wrap');
        expect(document.activeElement).toBe(query('#wrap'));
    });

    it('toggles a checkbox item and keeps the menu open', async () => {
        const { positioner, query } = await open();
        const item = query('#wrap');
        const indicator = query('#wrap-indicator');
        expect(item.getAttribute('role')).toBe('menuitemcheckbox');
        expect(item.getAttribute('aria-checked')).toBe('false');
        expect(indicator.hidden).toBe(true);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        item.addEventListener('checked-change', onChange);
        item.click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ checked: true }));
        expect(item.getAttribute('aria-checked')).toBe('true');
        expect(item.hasAttribute('data-checked')).toBe(true);
        expect(indicator.hidden).toBe(false);
        expect(topLayer.has(positioner)).toBe(true);
    });

    it('checks one radio item of a group', async () => {
        const { query } = await open();
        expect(query('#by-name').getAttribute('aria-checked')).toBe('true');
        const group = query('ui-menu-radio-group');
        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        group.addEventListener('value-change', onChange);

        query('#by-date').click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 'date' }));
        expect(query('#by-date').getAttribute('aria-checked')).toBe('true');
        expect(query('#by-name').getAttribute('aria-checked')).toBe('false');
        expect(group.getAttribute('role')).toBe('group');
    });

    it('labels a group with its label', async () => {
        const { query } = await open();
        expect(query('#group').getAttribute('aria-labelledby')).toBe('group-label');
    });

    it('opens a submenu from its item, and closes both with an item of the submenu', async () => {
        const { positioner, query } = await open();
        const more = query('#more');
        const subPositioner = query('#sub-positioner');
        expect(more.getAttribute('aria-haspopup')).toBe('menu');

        // Opens on hover or with the keyboard (a mouse press does not toggle it).
        more.focus();
        key(more, 'ArrowRight');
        await until(() => document.activeElement === query('#export'));
        expect(document.activeElement).toBe(query('#export'));
        expect(topLayer.has(subPositioner)).toBe(true);
        expect(more.getAttribute('aria-expanded')).toBe('true');
        expect(subPositioner.hasAttribute('data-nested')).toBe(true);
        // Each popup keeps its own id.
        const [mainPopup, subPopup] = [...document.querySelectorAll('ui-menu-popup')];
        expect(subPopup?.id).not.toBe('sub-positioner');
        expect(mainPopup?.id).not.toBe(subPopup?.id);
        expect(more.getAttribute('aria-controls')).toBe(subPopup?.id);

        query('#export').click();
        await tick();
        expect(topLayer.has(subPositioner)).toBe(false);
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('blocks the page with an internal backdrop while modal, and closes on a press on it', async () => {
        const { root, positioner, button } = await open();
        const internal = root.shadowRoot?.querySelector('div') as HTMLElement;
        expect(topLayer.has(internal)).toBe(true);
        const order = showPopover.mock.contexts;
        expect(order.lastIndexOf(internal)).toBeLessThan(order.lastIndexOf(positioner));

        internal.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0 }));
        internal.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true, button: 0 }));
        internal.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, button: 0 }));
        await tick();
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('has no internal backdrop with `modal="false"`', async () => {
        const { root, button } = mount('modal="false"');
        await tick();
        button.click();
        await tick();
        const internal = root.shadowRoot?.querySelector('div');
        expect(internal == null || !topLayer.has(internal)).toBe(true);
    });

    it('closes on Escape and gives the focus back to the trigger', async () => {
        const { popup, button, positioner } = await open();
        await until(() => popup.contains(document.activeElement));
        key(popup, 'Escape');
        await until(() => document.activeElement === button);
        expect(topLayer.has(positioner)).toBe(false);
        expect(document.activeElement).toBe(button);
    });
});
