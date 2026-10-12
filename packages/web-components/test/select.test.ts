import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { formEntries, stubElementInternals } from './stubElementInternals';
import { stubPopoverApi } from './stubPopoverApi';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { internalsOf, restore: restoreInternals } = stubElementInternals();
const { topLayer, restore: restorePopover } = stubPopoverApi();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(() => {
    restoreInternals();
    restorePopover();
});

afterEach(() => {
    document.body.innerHTML = '';
    topLayer.clear();
});

async function until(condition: () => boolean) {
    for (let i = 0; i < 20 && !condition(); i++) {
        await tick();
    }
}

async function mount(rootAttributes = 'name="fruit"') {
    const container = document.createElement('div');
    container.innerHTML = `
        <ui-select ${rootAttributes}>
            <ui-select-trigger as-child><button><ui-select-value placeholder="Pick a fruit"></ui-select-value><ui-select-icon>▾</ui-select-icon></button></ui-select-trigger>
            <ui-select-positioner>
                <ui-select-popup>
                    <ui-select-item id="apple" value="apple"><ui-select-item-indicator>✓</ui-select-item-indicator><ui-select-item-text>Apple</ui-select-item-text></ui-select-item>
                    <ui-select-item id="pear" value="pear"><ui-select-item-indicator>✓</ui-select-item-indicator><ui-select-item-text>Pear</ui-select-item-text></ui-select-item>
                    <ui-select-group id="group">
                        <ui-select-group-label id="group-label">Other</ui-select-group-label>
                        <ui-select-item id="plum" value="plum" disabled>Plum</ui-select-item>
                    </ui-select-group>
                </ui-select-popup>
            </ui-select-positioner>
        </ui-select>`;
    document.body.append(container);
    await tick();
    await tick();
    const query = (selector: string) => container.querySelector(selector) as HTMLElement;
    return { query, root: query('ui-select'), button: query('button'), positioner: query('ui-select-positioner') };
}

const valueText = (element: Element) => element.shadowRoot?.querySelector('slot')?.textContent;

describe('select', () => {
    it('keeps its placeholder when it gets the labels of its values', async () => {
        const { query, root } = await mount();
        (root as HTMLElement & { items: Record<string, string> }).items = { apple: 'Apple', pear: 'Pear' };
        await tick();
        expect(valueText(query('ui-select-value'))).toBe('Pick a fruit');
    });

    it('shows its placeholder and opens its list in the top layer', async () => {
        const { query, button, positioner } = await mount();
        expect(button.getAttribute('role')).toBe('combobox');
        expect(valueText(query('ui-select-value'))).toBe('Pick a fruit');
        expect(query('ui-select-value').hasAttribute('data-placeholder')).toBe(true);
        expect(topLayer.has(positioner)).toBe(false);

        button.click();
        await tick();
        expect(topLayer.has(positioner)).toBe(true);
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(query('ui-select-popup').getAttribute('role')).toBe('listbox');
        expect(query('#apple').getAttribute('role')).toBe('option');
        expect(query('#plum').getAttribute('aria-disabled')).toBe('true');
        expect(query('#group').getAttribute('aria-labelledby')).toBe('group-label');
    });

    it('chooses an item: shows its text, submits its value and closes', async () => {
        const { query, root, button, positioner } = await mount();
        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('value-change', onChange);
        button.click();
        await tick();
        // A pointer highlights the item it moves over; a click chooses the highlighted item.
        const pear = query('#pear');
        pear.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
        pear.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        await tick();
        pear.click();
        await until(() => !topLayer.has(positioner));

        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 'pear' }));
        expect(topLayer.has(positioner)).toBe(false);
        expect(valueText(query('ui-select-value'))).toBe('Pear');
        expect(query('#pear').hasAttribute('data-selected')).toBe(true);
        expect((query('#pear ui-select-item-indicator') as HTMLElement).hidden).toBe(false);
        expect((query('#apple ui-select-item-indicator') as HTMLElement).hidden).toBe(true);
        expect(formEntries(internalsOf(root)?.formValue)).toEqual([['fruit', 'pear']]);
    });

    it('labels the value with the given items', async () => {
        const { query, root } = await mount('default-value="apple"');
        (root as HTMLElement & { items?: Record<string, string> }).items = { apple: 'Red apple', pear: 'Pear' };
        await tick();
        expect(valueText(query('ui-select-value'))).toBe('Red apple');
    });

    it('closes on Escape and gives the focus back to the trigger', async () => {
        const { query, button, positioner } = await mount();
        button.focus();
        button.click();
        await until(() => query('ui-select-popup').contains(document.activeElement));
        query('ui-select-popup').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await until(() => document.activeElement === button);
        expect(topLayer.has(positioner)).toBe(false);
        expect(document.activeElement).toBe(button);
    });
});
