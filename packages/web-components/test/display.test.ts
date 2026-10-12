import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { define } from '../src';

const tick = () => new Promise((resolve) => setTimeout(resolve));

beforeAll(() => {
    define({ prefix: 'ui' });
});

afterEach(() => {
    document.body.innerHTML = '';
});

async function mount<T extends HTMLElement = HTMLElement>(markup: string) {
    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    await tick();
    return (selector: string) => container.querySelector(selector) as T;
}

const fallbackText = (element: Element) => element.shadowRoot?.querySelector('slot')?.textContent;

describe('button', () => {
    it('is a button, and stays focusable when disabled if asked', async () => {
        const query = await mount('<ui-button id="a">Go</ui-button><ui-button id="b" disabled focusable-when-disabled>No</ui-button>');
        expect(query('#a').getAttribute('role')).toBe('button');
        expect(query('#a').tabIndex).toBe(0);
        expect(query('#b').getAttribute('aria-disabled')).toBe('true');
        expect(query('#b').hasAttribute('data-disabled')).toBe(true);
        expect(query('#b').tabIndex).toBe(0);
    });
});

describe('separator', () => {
    it('has the separator role and orientation', async () => {
        const query = await mount('<ui-separator orientation="vertical"></ui-separator>');
        const separator = query('ui-separator');
        expect(separator.getAttribute('role')).toBe('separator');
        expect(separator.getAttribute('aria-orientation')).toBe('vertical');
        expect(separator.getAttribute('data-orientation')).toBe('vertical');
    });
});

describe('progress', () => {
    const markup = (value: string) => `
        <ui-progress ${value}>
            <ui-progress-label>Upload</ui-progress-label>
            <ui-progress-value></ui-progress-value>
            <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
        </ui-progress>`;

    it('shows the value, labelled, and follows it', async () => {
        const query = await mount(markup('value="25"'));
        const root = query('ui-progress') as HTMLElement & { value?: number; format?: Intl.NumberFormatOptions };
        expect(root.getAttribute('role')).toBe('progressbar');
        expect(root.getAttribute('aria-valuenow')).toBe('25');
        expect(root.getAttribute('aria-labelledby')).toBe(query('ui-progress-label').id);
        expect(root.hasAttribute('data-progressing')).toBe(true);
        expect(fallbackText(query('ui-progress-value'))).toBe('25%');
        expect(query('ui-progress-indicator').style.width).toBe('25%');

        root.value = 100;
        await tick();
        expect(root.hasAttribute('data-complete')).toBe(true);
        expect(query('ui-progress-track').hasAttribute('data-complete')).toBe(true);
        expect(query('ui-progress-indicator').style.width).toBe('100%');

        // A property-only option.
        root.format = { style: 'unit', unit: 'kilobyte' };
        await tick();
        expect(fallbackText(query('ui-progress-value'))).toContain('100');
        expect(fallbackText(query('ui-progress-value'))).not.toBe('100%');
    });

    it('is indeterminate without a value', async () => {
        const query = await mount(markup(''));
        expect(query('ui-progress').hasAttribute('data-indeterminate')).toBe(true);
        expect(query('ui-progress').hasAttribute('aria-valuenow')).toBe(false);
        expect(fallbackText(query('ui-progress-value'))).toBe('');
    });

    it('keeps the content the page gives the value', async () => {
        const query = await mount(`<ui-progress value="10"><ui-progress-value>ten</ui-progress-value></ui-progress>`);
        expect(query('ui-progress-value').textContent).toBe('ten');
    });
});

describe('meter', () => {
    it('is a labelled meter', async () => {
        const query = await mount(`
            <ui-meter value="40" max="200">
                <ui-meter-label>Storage</ui-meter-label><ui-meter-value></ui-meter-value>
                <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
            </ui-meter>`);
        const root = query('ui-meter');
        expect(root.getAttribute('role')).toBe('meter');
        expect(root.getAttribute('aria-valuemax')).toBe('200');
        expect(root.getAttribute('aria-labelledby')).toBe(query('ui-meter-label').id);
        expect(query('ui-meter-indicator').style.width).toBe('20%');
        // Formatted as a percentage of 100, like the headless component.
        expect(fallbackText(query('ui-meter-value'))).toBe('40%');
    });
});

describe('avatar', () => {
    it('shows the value as fallback text when the element only holds whitespace', async () => {
        document.body.innerHTML = `<ui-progress value="25"><ui-progress-value>
        </ui-progress-value></ui-progress>`;
        await tick();
        const value = document.querySelector('ui-progress-value') as HTMLElement;
        expect(fallbackText(value)).toBe('25%');
        expect(value.shadowRoot?.querySelector('slot')?.name).toBe('flippo-fallback');
        value.textContent = 'Custom';
        await tick();
        expect(value.shadowRoot?.querySelector('slot')?.name).toBe('');
    });

    it('shows the image once loaded instead of the fallback', async () => {
        const query = await mount(`
            <ui-avatar>
                <ui-avatar-image src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Ada"></ui-avatar-image>
                <ui-avatar-fallback>AL</ui-avatar-fallback>
            </ui-avatar>`);
        await tick();
        const image = query('ui-avatar-image');
        expect(image.hidden).toBe(false);
        const inner = image.shadowRoot?.querySelector('img');
        expect(inner?.getAttribute('src')).toContain('data:image/gif');
        expect(inner?.getAttribute('alt')).toBe('Ada');
        expect(query('ui-avatar-fallback').hidden).toBe(true);
    });

    it('shows the fallback without an image, after its delay', async () => {
        const query = await mount(`<ui-avatar><ui-avatar-fallback delay="30">AL</ui-avatar-fallback></ui-avatar>`);
        expect(query('ui-avatar-fallback').hidden).toBe(true);
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(query('ui-avatar-fallback').hidden).toBe(false);
    });
});
