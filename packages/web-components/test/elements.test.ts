import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { CollapsibleElement, CollapsiblePanelElement, CollapsibleTriggerElement, define } from '../src';

declare global {
    var FLIPPO_UI_ANIMATIONS_DISABLED: boolean | undefined;
}

const tick = () => new Promise((resolve) => setTimeout(resolve));

function mount(html: string): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    return container;
}

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterEach(() => {
    document.body.innerHTML = '';
});

describe('define', () => {
    it('registers prefixed tags once and rejects invalid prefixes', () => {
        expect(customElements.get('ui-toggle')).toBeDefined();
        expect(customElements.get('ui-collapsible-panel')).toBeDefined();
        expect(() => define({ prefix: 'ui' })).not.toThrow();
        expect(() => define({ prefix: 'UI' })).toThrow('Invalid tag prefix');
    });
});

describe('toggle', () => {
    it('is a button that toggles and reports the change', async () => {
        const container = mount('<ui-toggle value="bold">B</ui-toggle>');
        const toggle = container.querySelector('ui-toggle') as HTMLElement & { pressed?: boolean };
        await tick();

        expect(toggle.getAttribute('role')).toBe('button');
        expect(toggle.getAttribute('tabindex')).toBe('0');
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
        expect(toggle.hasAttribute('data-pressed')).toBe(false);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        toggle.addEventListener('pressed-change', onChange);
        toggle.click();
        expect(onChange).toHaveReturnedWith({ pressed: true, reason: 'none' });
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
        expect(toggle.hasAttribute('data-pressed')).toBe(true);

        // Keyboard activation of a non-native button.
        toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });

    it('cancels the change when the event is prevented', async () => {
        const container = mount('<ui-toggle></ui-toggle>');
        const toggle = container.querySelector('ui-toggle') as HTMLElement;
        await tick();
        toggle.addEventListener('pressed-change', (event) => event.preventDefault());
        toggle.click();
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });

    it('follows a controlled `pressed`, set as an attribute or a property', async () => {
        const container = mount('<ui-toggle pressed></ui-toggle>');
        const toggle = container.querySelector('ui-toggle') as HTMLElement & { pressed?: boolean };
        await tick();
        expect(toggle.getAttribute('aria-pressed')).toBe('true');

        const onChange = vi.fn();
        toggle.addEventListener('pressed-change', onChange);
        toggle.click();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');

        toggle.pressed = false;
        expect(toggle.getAttribute('aria-pressed')).toBe('true'); // applied together, in a microtask
        await tick();
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });

    it('is disabled', async () => {
        const container = mount('<ui-toggle disabled></ui-toggle>');
        const toggle = container.querySelector('ui-toggle') as HTMLElement;
        await tick();
        expect(toggle.hasAttribute('data-disabled')).toBe(true);
        expect(toggle.getAttribute('aria-disabled')).toBe('true');
        // Its own option attribute is left alone.
        expect(toggle.getAttribute('disabled')).toBe('');
        toggle.click();
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });

    it('applies its props to its child with `as-child`, and follows a replaced child', async () => {
        const container = mount('<ui-toggle as-child><button>B</button></ui-toggle>');
        const toggle = container.querySelector('ui-toggle') as HTMLElement;
        const button = toggle.querySelector('button') as HTMLButtonElement;
        await tick();

        expect(toggle.style.display).toBe('contents');
        expect(toggle.hasAttribute('aria-pressed')).toBe(false);
        expect(button.getAttribute('aria-pressed')).toBe('false');
        expect(button.getAttribute('type')).toBe('button');
        expect(button.hasAttribute('role')).toBe(false); // a native button

        button.click();
        expect(button.getAttribute('aria-pressed')).toBe('true');

        const next = document.createElement('button');
        button.replaceWith(next);
        await tick();
        expect(button.hasAttribute('aria-pressed')).toBe(false);
        expect(next.getAttribute('aria-pressed')).toBe('true');
        next.click();
        expect(next.getAttribute('aria-pressed')).toBe('false');
    });

    it('keeps its state and listeners when moved', async () => {
        const container = mount('<ui-toggle></ui-toggle>');
        const toggle = container.querySelector('ui-toggle') as HTMLElement;
        await tick();
        toggle.click();

        const other = mount('');
        other.append(toggle);
        await tick();
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
        toggle.click();
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });
});

describe('collapsible', () => {
    const markup = (rootAttributes = '', panelAttributes = '') => `
        <ui-collapsible ${rootAttributes}>
            <ui-collapsible-trigger>Toggle</ui-collapsible-trigger>
            <ui-collapsible-panel ${panelAttributes}>Content</ui-collapsible-panel>
        </ui-collapsible>`;

    it('opens and closes the panel from the trigger', async () => {
        const container = mount(markup());
        const root = container.querySelector('ui-collapsible') as HTMLElement;
        const trigger = container.querySelector('ui-collapsible-trigger') as HTMLElement;
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        await tick();

        expect(panel.hidden).toBe(true);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(root.hasAttribute('data-closed')).toBe(true);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('open-change', onChange);
        trigger.click();
        await tick();

        expect(onChange).toHaveReturnedWith({ open: true, reason: 'trigger-press' });
        expect(panel.hidden).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
        expect(panel.id).toMatch(/^flippo-collapsible-panel-/);
        expect(root.hasAttribute('data-open')).toBe(true);
        expect(panel.hasAttribute('data-open')).toBe(true);

        trigger.click();
        await tick();
        expect(panel.hidden).toBe(true);
    });

    it('keeps the id of the panel set by the page', async () => {
        const container = mount(markup('default-open', 'id="details"'));
        const trigger = container.querySelector('ui-collapsible-trigger') as HTMLElement;
        await tick();
        expect(trigger.getAttribute('aria-controls')).toBe('details');
    });

    it('follows a controlled `open`', async () => {
        const container = mount(markup('open'));
        const root = container.querySelector('ui-collapsible') as HTMLElement & { open?: boolean };
        const trigger = container.querySelector('ui-collapsible-trigger') as HTMLElement;
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        await tick();
        expect(panel.hidden).toBe(false);

        trigger.click();
        await tick();
        expect(panel.hidden).toBe(false);

        root.open = false;
        await tick();
        expect(panel.hidden).toBe(true);
    });

    it('hides the panel `until-found`', async () => {
        const container = mount(markup('', 'hidden-until-found'));
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        await tick();
        expect(panel.getAttribute('hidden')).toBe('until-found');
    });

    it('disables the trigger from the root', async () => {
        const container = mount(markup('disabled'));
        const trigger = container.querySelector('ui-collapsible-trigger') as HTMLElement;
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        await tick();
        expect(trigger.getAttribute('aria-disabled')).toBe('true');
        trigger.click();
        await tick();
        expect(panel.hidden).toBe(true);
    });

    it('waits for a root that is defined after its parts', async () => {
        customElements.define('late-collapsible-trigger', class extends CollapsibleTriggerElement {});
        customElements.define('late-collapsible-panel', class extends CollapsiblePanelElement {});
        const container = mount(`
            <late-collapsible>
                <late-collapsible-trigger>Toggle</late-collapsible-trigger>
                <late-collapsible-panel>Content</late-collapsible-panel>
            </late-collapsible>`);
        const trigger = container.querySelector('late-collapsible-trigger') as HTMLElement;
        const panel = container.querySelector('late-collapsible-panel') as HTMLElement;
        await tick();
        expect(trigger.hasAttribute('aria-expanded')).toBe(false);

        customElements.define('late-collapsible', class extends CollapsibleElement {});
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        trigger.click();
        await tick();
        expect(panel.hidden).toBe(false);
    });

    it('supports `as-child` on the trigger', async () => {
        const container = mount(`
            <ui-collapsible>
                <ui-collapsible-trigger as-child><button>Toggle</button></ui-collapsible-trigger>
                <ui-collapsible-panel>Content</ui-collapsible-panel>
            </ui-collapsible>`);
        const button = container.querySelector('button') as HTMLButtonElement;
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        await tick();
        expect(button.getAttribute('aria-expanded')).toBe('false');
        button.click();
        await tick();
        expect(panel.hidden).toBe(false);
        expect(button.getAttribute('aria-expanded')).toBe('true');
    });
});
