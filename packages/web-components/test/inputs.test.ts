import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { formEntries, stubElementInternals } from './stubElementInternals';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { internalsOf, restore } = stubElementInternals();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(restore);

afterEach(() => {
    document.body.innerHTML = '';
});

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

const fallbackText = (element: Element) => element.shadowRoot?.querySelector('slot')?.textContent;

describe('slider', () => {
    it('moves its thumb with the keyboard and submits its value', async () => {
        const query = await mount(`
            <ui-field name="volume">
                <ui-field-label>Volume</ui-field-label>
                <ui-slider default-value="40">
                    <ui-slider-value></ui-slider-value>
                    <ui-slider-control><ui-slider-track>
                        <ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb>
                    </ui-slider-track></ui-slider-control>
                </ui-slider>
            </ui-field>`);
        const slider = query('ui-slider');
        const thumb = query('ui-slider-thumb');
        const input = thumb.shadowRoot?.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('type')).toBe('range');
        expect(input.getAttribute('aria-valuenow')).toBe('40');
        // The label is out of the shadow root: its text is the input's name.
        expect(input.getAttribute('aria-label')).toBe('Volume');
        expect(fallbackText(query('ui-slider-value'))).toBe('40');
        expect(formEntries(internalsOf(slider)?.formValue)).toEqual([['volume', '40']]);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        slider.addEventListener('value-change', onChange);
        input.focus();
        key(input, 'ArrowRight');
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 41 }));
        expect(input.getAttribute('aria-valuenow')).toBe('41');
        expect(formEntries(internalsOf(slider)?.formValue)).toEqual([['volume', '41']]);
        expect(query('ui-slider-indicator').getAttribute('style')).toContain('41%');
    });

    it('has two thumbs for a range', async () => {
        const query = await mount(`
            <ui-slider default-value="20 80" name="price">
                <ui-slider-control><ui-slider-thumb index="0"></ui-slider-thumb><ui-slider-thumb index="1"></ui-slider-thumb></ui-slider-control>
            </ui-slider>`);
        const inputs = [...document.querySelectorAll('ui-slider-thumb')].map((thumb) => thumb.shadowRoot?.querySelector('input'));
        expect(inputs.map((input) => input?.getAttribute('aria-valuenow'))).toEqual(['20', '80']);
        expect(formEntries(internalsOf(query('ui-slider'))?.formValue)).toEqual([
            ['price', '20'],
            ['price', '80']
        ]);
    });
});

describe('number field', () => {
    it('steps its value with the buttons and the keyboard', async () => {
        const query = await mount(`
            <ui-number-field default-value="5" name="qty" min="0" max="10">
                <ui-number-field-group>
                    <ui-number-field-decrement>-</ui-number-field-decrement>
                    <ui-number-field-input as-child><input /></ui-number-field-input>
                    <ui-number-field-increment>+</ui-number-field-increment>
                </ui-number-field-group>
            </ui-number-field>`);
        const field = query('ui-number-field');
        const input = query('input') as HTMLInputElement;
        expect(input.value).toBe('5');
        expect(formEntries(internalsOf(field)?.formValue)).toEqual([['qty', '5']]);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        field.addEventListener('value-change', onChange);
        const increment = query('ui-number-field-increment');
        increment.click();
        await tick();
        expect(onChange).toHaveBeenCalled();
        expect(input.value).toBe('6');

        input.focus();
        key(input, 'ArrowDown');
        await tick();
        expect(input.value).toBe('5');
        expect(formEntries(internalsOf(field)?.formValue)).toEqual([['qty', '5']]);
    });
});

describe('pin input', () => {
    it('fills its pins and submits the code', async () => {
        const query = await mount(`
            <ui-pin-input name="code">
                <ui-pin-input-group>
                    <ui-pin-input-pin as-child><input id="p0" /></ui-pin-input-pin>
                    <ui-pin-input-pin as-child><input id="p1" /></ui-pin-input-pin>
                </ui-pin-input-group>
            </ui-pin-input>`);
        const root = query('ui-pin-input');
        const first = query('#p0') as HTMLInputElement;
        const second = query('#p1') as HTMLInputElement;
        expect(first.getAttribute('placeholder')).toBe('○');
        const onComplete = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('value-complete', onComplete);

        first.focus();
        first.value = '4';
        first.dispatchEvent(new InputEvent('input', { bubbles: true, data: '4', inputType: 'insertText' }));
        await tick();
        expect(document.activeElement).toBe(second);
        second.value = '2';
        second.dispatchEvent(new InputEvent('input', { bubbles: true, data: '2', inputType: 'insertText' }));
        await tick();
        expect(onComplete).toHaveReturnedWith({ value: '42', values: ['4', '2'] });
        expect(formEntries(internalsOf(root)?.formValue)).toEqual([['code', '42']]);
    });
});

describe('scroll area', () => {
    it('lays out a viewport and hides the scrollbars without overflow', async () => {
        const query = await mount(`
            <ui-scroll-area>
                <ui-scroll-area-viewport><ui-scroll-area-content>Text</ui-scroll-area-content></ui-scroll-area-viewport>
                <ui-scroll-area-scrollbar><ui-scroll-area-thumb></ui-scroll-area-thumb></ui-scroll-area-scrollbar>
                <ui-scroll-area-corner></ui-scroll-area-corner>
            </ui-scroll-area>`);
        // Measured on resize: happy-dom lays nothing out, sizes are stubbed (no overflow).
        const sizes = { clientHeight: 100, scrollHeight: 100, clientWidth: 100, scrollWidth: 100 };
        for (const [name, value] of Object.entries(sizes)) {
            Object.defineProperty(query('ui-scroll-area-viewport'), name, { value, configurable: true });
        }
        (query('ui-scroll-area') as HTMLElement & { machine: { computeThumbPosition(): void } }).machine.computeThumbPosition();
        await tick();
        const viewport = query('ui-scroll-area-viewport');
        expect(viewport.style.overflow).toContain('scroll');
        expect(query('ui-scroll-area-scrollbar').hidden).toBe(true);
        expect(query('ui-scroll-area-scrollbar').getAttribute('data-orientation')).toBe('vertical');
        expect(query('ui-scroll-area-corner').hidden).toBe(true);
    });
});
