import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

const tick = () => new Promise((resolve) => setTimeout(resolve));

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

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

describe('snippet', () => {
    it('copies its lines', async () => {
        const writeText = vi.fn(() => Promise.resolve());
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        const query = await mount(`
            <ui-snippet>
                <ui-snippet-line><ui-snippet-symbol></ui-snippet-symbol> npm install</ui-snippet-line>
                <ui-snippet-line value="npm test">ignored text</ui-snippet-line>
                <ui-snippet-copy-button>Copy</ui-snippet-copy-button>
            </ui-snippet>`);
        expect(query('ui-snippet-symbol').shadowRoot?.querySelector('slot')?.textContent).toBe('$');
        const onCopied = vi.fn((event: Event) => (event as CustomEvent).detail);
        query('ui-snippet').addEventListener('copied', onCopied);
        query('ui-snippet-copy-button').click();
        await tick();
        await tick();
        expect(writeText).toHaveBeenCalledOnce();
        expect(String((writeText.mock.calls[0] as unknown[])[0])).toContain('npm test');
        expect(query('ui-snippet-copy-button').hasAttribute('data-copied')).toBe(true);
    });
});

describe('marquee', () => {
    it('shows copies of its content, out of the accessibility tree', async () => {
        const query = await mount(`
            <ui-marquee speed="100"><ui-marquee-track><span id="item">News</span></ui-marquee-track></ui-marquee>`);
        const root = query('ui-marquee');
        expect(root.style.overflow).toBe('hidden');
        expect(root.hasAttribute('data-playing')).toBe(true);
        const copies = [...query('ui-marquee-track').querySelectorAll('[data-flippo-marquee-copy]')];
        expect(copies.length).toBeGreaterThanOrEqual(2);
        expect(copies.every((copy) => copy.getAttribute('aria-hidden') === 'true' && copy.hasAttribute('inert'))).toBe(true);
        // Ids are not copied.
        expect(document.querySelectorAll('#item')).toHaveLength(1);
        expect(copies[0]?.textContent).toBe('News');
    });
});

describe('qr code', () => {
    it('draws the code with the given renderer, in the frame', async () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <ui-qr-code value="https://example.com">
                <ui-qr-code-frame></ui-qr-code-frame>
                <ui-qr-code-generate-trigger>Again</ui-qr-code-generate-trigger>
            </ui-qr-code>`;
        const root = container.querySelector('ui-qr-code') as HTMLElement & { createRenderer?: (options: object) => object };
        const append = vi.fn((target: HTMLElement) => target.append(document.createElement('canvas')));
        root.createRenderer = (options) => ({
            options,
            append,
            getRawData: () => Promise.resolve(null),
            download: () => Promise.resolve()
        });
        document.body.append(container);
        await tick();
        await tick();
        expect(append).toHaveBeenCalled();
        const frame = container.querySelector('ui-qr-code-frame') as HTMLElement;
        expect(frame.shadowRoot?.querySelector('[part="code"] canvas')).not.toBeNull();
        expect(root.hasAttribute('data-status-generated')).toBe(true);
    });
});
