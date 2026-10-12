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

async function mount(markup: string) {
    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    await tick();
    await tick();
    return (selector: string) => container.querySelector(selector) as HTMLElement;
}

const key = (element: Element, value: string) =>
    element.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, composed: true, cancelable: true }));

describe('context menu', () => {
    it('opens at the pointer on a right click', async () => {
        const query = await mount(`
            <ui-context-menu>
                <ui-context-menu-trigger id="area">Right click here</ui-context-menu-trigger>
                <ui-menu-positioner id="positioner">
                    <ui-menu-popup><ui-menu-item id="copy">Copy</ui-menu-item></ui-menu-popup>
                </ui-menu-positioner>
            </ui-context-menu>`);
        const area = query('#area');
        expect(topLayer.has(query('#positioner'))).toBe(false);
        area.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 40, clientY: 50, button: 2 }));
        await until(() => topLayer.has(query('#positioner')));
        expect(topLayer.has(query('#positioner'))).toBe(true);
        expect(area.hasAttribute('data-popup-open')).toBe(true);
        expect(query('#copy').getAttribute('role')).toBe('menuitem');

        query('#copy').click();
        await until(() => !topLayer.has(query('#positioner')));
        expect(topLayer.has(query('#positioner'))).toBe(false);
    });
});

describe('menubar', () => {
    it('moves between its menus and opens them', async () => {
        const query = await mount(`
            <ui-menubar>
                <ui-menu>
                    <ui-menu-trigger id="file">File</ui-menu-trigger>
                    <ui-menu-positioner id="file-menu"><ui-menu-popup><ui-menu-item>New</ui-menu-item></ui-menu-popup></ui-menu-positioner>
                </ui-menu>
                <ui-menu>
                    <ui-menu-trigger id="edit">Edit</ui-menu-trigger>
                    <ui-menu-positioner id="edit-menu"><ui-menu-popup><ui-menu-item>Undo</ui-menu-item></ui-menu-popup></ui-menu-positioner>
                </ui-menu>
            </ui-menubar>`);
        expect(query('ui-menubar').getAttribute('role')).toBe('menubar');
        const file = query('#file');
        const edit = query('#edit');
        expect(file.getAttribute('role')).toBe('menuitem');
        expect(file.tabIndex).toBe(0);
        expect(edit.tabIndex).toBe(-1);

        file.focus();
        key(file, 'ArrowRight');
        await tick();
        expect(document.activeElement).toBe(edit);

        edit.click();
        await until(() => topLayer.has(query('#edit-menu')));
        expect(topLayer.has(query('#edit-menu'))).toBe(true);
        expect(query('ui-menubar').hasAttribute('data-has-submenu-open')).toBe(true);
    });
});
