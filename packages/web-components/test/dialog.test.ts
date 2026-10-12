import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

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

const press = (element: Element) => {
    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0 }));
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true, button: 0 }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, button: 0 }));
};

function mount(rootAttributes = '') {
    const container = document.createElement('div');
    container.innerHTML = `
        <ui-dialog ${rootAttributes}>
            <ui-dialog-trigger>Open</ui-dialog-trigger>
            <ui-dialog-backdrop></ui-dialog-backdrop>
            <ui-dialog-popup>
                <ui-dialog-title>Title</ui-dialog-title>
                <ui-dialog-description>Description</ui-dialog-description>
                <input id="field" />
                <ui-dialog-close>Close</ui-dialog-close>
            </ui-dialog-popup>
        </ui-dialog>
        <button id="outside">Outside</button>`;
    document.body.append(container);
    const query = (selector: string) => container.querySelector(selector) as HTMLElement;
    const root = query('ui-dialog');
    return {
        root,
        trigger: query('ui-dialog-trigger'),
        backdrop: query('ui-dialog-backdrop'),
        popup: query('ui-dialog-popup'),
        title: query('ui-dialog-title'),
        description: query('ui-dialog-description'),
        close: query('ui-dialog-close'),
        outside: query('#outside'),
        internalBackdrop: () => root.shadowRoot?.querySelector('div') as HTMLElement | null,
        guards: () => [...(root.shadowRoot?.querySelectorAll('[data-base-ui-focus-guard]') ?? [])] as HTMLElement[]
    };
}

describe('dialog', () => {
    it('opens a modal dialog stacked above its backdrops in the top layer', async () => {
        const { trigger, backdrop, popup, title, description, outside, internalBackdrop } = mount();
        await tick();
        expect(popup.hidden).toBe(true);

        trigger.click();
        await tick();

        expect(popup.getAttribute('role')).toBe('dialog');
        expect(popup.getAttribute('aria-labelledby')).toBe(title.id);
        expect(popup.getAttribute('aria-describedby')).toBe(description.id);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        // Centered by the browser: only the decoration of `[popover]` is reset.
        expect(popup.getAttribute('data-flippo-top-layer')).toBe('centered');

        const order = showPopover.mock.contexts;
        const internal = internalBackdrop() as HTMLElement;
        expect(topLayer.has(internal) && topLayer.has(backdrop) && topLayer.has(popup)).toBe(true);
        expect(order.lastIndexOf(internal)).toBeLessThan(order.lastIndexOf(backdrop));
        expect(order.lastIndexOf(backdrop)).toBeLessThan(order.lastIndexOf(popup));
        expect(outside.hasAttribute('data-base-ui-inert')).toBe(true);
    });

    it('traps the focus with guards in the shadow root of the root', async () => {
        const { trigger, popup, guards } = mount();
        await tick();
        trigger.click();
        await tick();

        const [before, after] = guards();
        expect(before?.hidden).toBe(false);
        // The guards are outside of the popup: its tabbable content is only the page's markup.
        expect(popup.contains(before as Node)).toBe(false);

        after?.focus();
        await tick();
        await tick();
        expect(popup.contains(document.activeElement)).toBe(true);
    });

    it('closes with the close button, on Escape and on a press on the backdrop', async () => {
        const { trigger, popup, close, internalBackdrop } = mount();
        await tick();

        trigger.click();
        await tick();
        close.click();
        await tick();
        expect(topLayer.has(popup)).toBe(false);

        trigger.click();
        await tick();
        popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');

        trigger.click();
        await tick();
        press(internalBackdrop() as HTMLElement);
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(topLayer.size).toBe(0);
    });

    it('closes on a press on its own backdrop when the page has other top-level elements', async () => {
        // As in an app: the dialog sits alone in its root, the page's other root elements are marked inert.
        const sibling = document.createElement('div');
        const app = document.createElement('div');
        app.innerHTML = `
            <ui-dialog>
                <ui-dialog-trigger>Open</ui-dialog-trigger>
                <ui-dialog-backdrop></ui-dialog-backdrop>
                <ui-dialog-popup><ui-dialog-close>Close</ui-dialog-close></ui-dialog-popup>
            </ui-dialog>`;
        document.body.append(sibling, app);
        const trigger = app.querySelector('ui-dialog-trigger') as HTMLElement;
        await tick();

        trigger.click();
        await tick();
        expect(sibling.hasAttribute('data-base-ui-inert')).toBe(true);
        press(app.querySelector('ui-dialog-backdrop') as HTMLElement);
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('stays open on a press outside with `disable-pointer-dismissal`', async () => {
        const { trigger, internalBackdrop } = mount('disable-pointer-dismissal');
        await tick();
        trigger.click();
        await tick();
        press(internalBackdrop() as HTMLElement);
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('lets the page be used with `modal="false"`', async () => {
        const { trigger, outside, internalBackdrop, guards } = mount('modal="false"');
        await tick();
        trigger.click();
        await tick();
        expect(internalBackdrop() === null || !topLayer.has(internalBackdrop() as HTMLElement)).toBe(true);
        expect(outside.hasAttribute('inert')).toBe(false);
        expect(guards().every((guard) => guard.hidden)).toBe(true);

        press(outside);
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('keeps the id the page gives the popup, and refers to it', async () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <ui-dialog>
                <ui-dialog-trigger>Open</ui-dialog-trigger>
                <ui-dialog-popup id="settings">Settings</ui-dialog-popup>
            </ui-dialog>`;
        document.body.append(container);
        const trigger = container.querySelector('ui-dialog-trigger') as HTMLElement;
        await tick();
        trigger.click();
        await tick();
        expect(container.querySelector('#settings')).not.toBeNull();
        expect(trigger.getAttribute('aria-controls')).toBe('settings');
    });

    it('nests a dialog in the popup of another one', async () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <ui-dialog id="outer">
                <ui-dialog-trigger>Outer</ui-dialog-trigger>
                <ui-dialog-backdrop></ui-dialog-backdrop>
                <ui-dialog-popup id="outer-popup">
                    <ui-dialog id="inner">
                        <ui-dialog-trigger>Inner</ui-dialog-trigger>
                        <ui-dialog-backdrop id="inner-backdrop"></ui-dialog-backdrop>
                        <ui-dialog-popup id="inner-popup"><button id="inside">Inside</button></ui-dialog-popup>
                    </ui-dialog>
                </ui-dialog-popup>
            </ui-dialog>`;
        document.body.append(container);
        const [outerTrigger, innerTrigger] = [...container.querySelectorAll('ui-dialog-trigger')] as HTMLElement[];
        const outerPopup = container.querySelector('#outer-popup') as HTMLElement;
        const innerPopup = container.querySelector('#inner-popup') as HTMLElement;
        const innerBackdrop = container.querySelector('#inner-backdrop') as HTMLElement;
        await tick();

        outerTrigger?.click();
        await tick();
        innerTrigger?.click();
        await tick();

        expect(topLayer.has(innerPopup)).toBe(true);
        // A nested dialog has no backdrop of its own (unless `force-render`).
        expect(topLayer.has(innerBackdrop)).toBe(false);
        expect(outerPopup.hasAttribute('data-nested-dialog-open')).toBe(true);
        expect(showPopover.mock.contexts.lastIndexOf(outerPopup)).toBeLessThan(showPopover.mock.contexts.lastIndexOf(innerPopup));

        innerPopup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
        await tick();
        expect(innerTrigger?.getAttribute('aria-expanded')).toBe('false');
        expect(outerTrigger?.getAttribute('aria-expanded')).toBe('true');
    });
});
