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
        <ui-combobox ${rootAttributes}>
            <ui-combobox-input as-child><input /></ui-combobox-input>
            <ui-combobox-positioner>
                <ui-combobox-popup>
                    <ui-combobox-empty>No fruit</ui-combobox-empty>
                    <ui-combobox-list>
                        <ui-combobox-item id="apple" value="apple">Apple</ui-combobox-item>
                        <ui-combobox-item id="apricot" value="apricot">Apricot</ui-combobox-item>
                        <ui-combobox-item id="pear" value="pear">Pear</ui-combobox-item>
                    </ui-combobox-list>
                </ui-combobox-popup>
            </ui-combobox-positioner>
        </ui-combobox>`;
    document.body.append(container);
    await tick();
    await tick();
    const query = (selector: string) => container.querySelector(selector) as HTMLElement;
    return { query, root: query('ui-combobox'), input: query('input') as HTMLInputElement, positioner: query('ui-combobox-positioner') };
}

const type = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: value, inputType: 'insertText' }));
};

describe('combobox', () => {
    it('filters the items of the document by the text', async () => {
        const { query, input, positioner } = await mount();
        expect(input.getAttribute('role')).toBe('combobox');
        input.focus();
        type(input, 'ap');
        await until(() => topLayer.has(positioner));
        expect(topLayer.has(positioner)).toBe(true);
        expect(query('#apple').hidden).toBe(false);
        expect(query('#apricot').hidden).toBe(false);
        expect(query('#pear').hidden).toBe(true);
        expect(query('ui-combobox-empty').hidden).toBe(true);

        type(input, 'zz');
        await tick();
        expect(query('#apple').hidden).toBe(true);
        expect(query('ui-combobox-empty').hidden).toBe(false);
    });

    it('chooses an item: fills the input with its text and submits its value', async () => {
        const { query, root, input, positioner } = await mount();
        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('value-change', onChange);
        input.focus();
        type(input, 'pe');
        await until(() => topLayer.has(positioner));
        query('#pear').click();
        await until(() => !topLayer.has(positioner));
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 'pear' }));
        expect(input.value).toBe('Pear');
        expect(formEntries(internalsOf(root)?.formValue)).toEqual([['fruit', 'pear']]);
    });

    it('highlights items with the arrow keys and chooses with Enter', async () => {
        const { query, root, input, positioner } = await mount();
        input.focus();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await until(() => topLayer.has(positioner));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await tick();
        const highlighted = query('[data-highlighted]');
        expect(highlighted).not.toBeNull();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await until(() => !topLayer.has(positioner));
        expect(formEntries(internalsOf(root)?.formValue)).toEqual([['fruit', highlighted.getAttribute('value') as string]]);
    });

    it('is an autocomplete: the value is the text', async () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <ui-autocomplete name="q">
                <ui-combobox-input as-child><input /></ui-combobox-input>
                <ui-combobox-positioner>
                    <ui-combobox-popup><ui-combobox-list>
                        <ui-combobox-item id="react" value="react">React</ui-combobox-item>
                        <ui-combobox-item id="vue" value="vue">Vue</ui-combobox-item>
                    </ui-combobox-list></ui-combobox-popup>
                </ui-combobox-positioner>
            </ui-autocomplete>`;
        document.body.append(container);
        await tick();
        await tick();
        const root = container.querySelector('ui-autocomplete') as HTMLElement;
        const input = container.querySelector('input') as HTMLInputElement;
        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('value-change', onChange);
        input.focus();
        type(input, 'vu');
        await until(() => topLayer.has(container.querySelector('ui-combobox-positioner') as HTMLElement));
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 'vu' }));
        expect((container.querySelector('#react') as HTMLElement).hidden).toBe(true);
        expect((container.querySelector('#vue') as HTMLElement).hidden).toBe(false);
    });
});
