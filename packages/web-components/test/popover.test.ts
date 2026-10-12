import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { stubPopoverApi } from './stubPopoverApi';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { topLayer, showPopover, hidePopover, restore } = stubPopoverApi();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(restore);

afterEach(() => {
    document.body.innerHTML = '';
    topLayer.clear();
    showPopover.mockClear();
    hidePopover.mockClear();
});

function mount(rootAttributes = '', triggerMarkup = '<ui-popover-trigger>Open</ui-popover-trigger>') {
    const container = document.createElement('div');
    container.innerHTML = `
        <ui-popover ${rootAttributes}>
            ${triggerMarkup}
            <ui-popover-positioner>
                <ui-popover-popup>
                    <ui-popover-title>Title</ui-popover-title>
                    <ui-popover-description>Description</ui-popover-description>
                    <ui-popover-close>Close</ui-popover-close>
                    <ui-popover-arrow></ui-popover-arrow>
                </ui-popover-popup>
            </ui-popover-positioner>
        </ui-popover>
        <button id="outside">Outside</button>`;
    document.body.append(container);
    const query = (selector: string) => container.querySelector(selector) as HTMLElement;
    return {
        root: query('ui-popover') as HTMLElement & { open?: boolean },
        trigger: query('ui-popover-trigger'),
        positioner: query('ui-popover-positioner'),
        popup: query('ui-popover-popup'),
        title: query('ui-popover-title'),
        description: query('ui-popover-description'),
        close: query('ui-popover-close'),
        outside: query('#outside')
    };
}

describe('popover', () => {
    it('opens from the trigger into the top layer, and links the parts', async () => {
        const { root, trigger, positioner, popup, title, description } = mount();
        await tick();

        expect(positioner.getAttribute('popover')).toBe('manual');
        expect(positioner.hidden).toBe(true);
        expect(topLayer.has(positioner)).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('open-change', onChange);
        trigger.click();
        await tick();

        expect(onChange).toHaveReturnedWith({ open: true, reason: 'trigger-press' });
        expect(topLayer.has(positioner)).toBe(true);
        expect(positioner.hidden).toBe(false);
        expect(positioner.style.position).toBe('fixed');
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(trigger.hasAttribute('data-popup-open')).toBe(true);
        expect(popup.getAttribute('role')).toBe('dialog');
        expect(trigger.getAttribute('aria-controls')).toBe(popup.id);
        expect(popup.getAttribute('aria-labelledby')).toBe(title.id);
        expect(popup.getAttribute('aria-describedby')).toBe(description.id);
        expect(popup.hasAttribute('data-open')).toBe(true);
    });

    it('closes with the close button and leaves the top layer', async () => {
        const { trigger, positioner, close } = mount();
        await tick();
        trigger.click();
        await tick();

        close.click();
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(topLayer.has(positioner)).toBe(false);
        expect(hidePopover).toHaveBeenCalledTimes(1);
        expect(positioner.hidden).toBe(true);
    });

    it('closes on Escape and on a press outside', async () => {
        const { trigger, outside } = mount();
        await tick();

        trigger.click();
        await tick();
        document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');

        trigger.click();
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
        outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 }));
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('does not open when the change is prevented', async () => {
        const { root, trigger, positioner } = mount();
        await tick();
        root.addEventListener('open-change', (event) => event.preventDefault());
        trigger.click();
        await tick();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('follows a controlled `open`', async () => {
        const { root, trigger, positioner } = mount('open');
        await tick();
        expect(topLayer.has(positioner)).toBe(true);

        const onChange = vi.fn();
        root.addEventListener('open-change', onChange);
        trigger.click();
        await tick();
        expect(onChange).toHaveBeenCalled();
        expect(topLayer.has(positioner)).toBe(true);

        root.open = false;
        await tick();
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('supports a native button as the trigger with `as-child`', async () => {
        const { positioner } = mount('', '<ui-popover-trigger as-child><button>Open</button></ui-popover-trigger>');
        const button = document.querySelector('ui-popover-trigger button') as HTMLButtonElement;
        await tick();
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(button.hasAttribute('role')).toBe(false);

        button.click();
        await tick();
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(topLayer.has(positioner)).toBe(true);
    });

    it('adds the reset styles of the top layer once', async () => {
        mount();
        mount();
        await tick();
        const styles = [...document.head.querySelectorAll('style')].filter((style) => style.textContent?.includes('data-flippo-top-layer'));
        expect(styles).toHaveLength(1);
    });

    describe('modal', () => {
        const guards = (positioner: HTMLElement) =>
            [...(positioner.shadowRoot?.querySelectorAll('[data-base-ui-focus-guard]') ?? [])] as HTMLElement[];

        it('makes the page inert, without guards (nothing outside can be focused)', async () => {
            const { trigger, positioner, close, outside } = mount('modal');
            await tick();
            trigger.click();
            await tick();
            expect(outside.hasAttribute('data-base-ui-inert')).toBe(true);
            expect(guards(positioner).every((guard) => guard.hidden)).toBe(true);

            close.click();
            await tick();
            expect(outside.hasAttribute('data-base-ui-inert')).toBe(false);
        });

        it('shows the internal backdrop below the popup, and closes when it is pressed', async () => {
            const { root, trigger, positioner } = mount('modal');
            await tick();
            showPopover.mockClear();
            trigger.click();
            await tick();

            const backdrop = root.shadowRoot?.querySelector('div') as HTMLElement;
            expect(backdrop.getAttribute('role')).toBe('presentation');
            expect(topLayer.has(backdrop)).toBe(true);
            const order = showPopover.mock.contexts;
            expect(order.indexOf(backdrop)).toBeLessThan(order.lastIndexOf(positioner));

            backdrop.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0 }));
            backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true, button: 0 }));
            backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, button: 0 }));
            await tick();
            expect(trigger.getAttribute('aria-expanded')).toBe('false');
            expect(topLayer.has(backdrop)).toBe(false);
        });

        it('traps the focus with guards in the shadow root with `modal="trap-focus"`', async () => {
            const { trigger, positioner, popup, close, outside } = mount('modal="trap-focus"');
            await tick();
            expect(guards(positioner).every((guard) => guard.hidden)).toBe(true);

            trigger.click();
            await tick();
            const [before, after] = guards(positioner);
            expect(before?.hidden).toBe(false);
            expect(before?.tabIndex).toBe(0);
            // The content stays in the light DOM, between the guards.
            expect(popup.parentElement).toBe(positioner);
            // Only the focus is trapped: no backdrop, and the page is hidden from screen readers but not inert.
            expect(topLayer.size).toBe(1);
            expect(outside.hasAttribute('inert')).toBe(false);
            expect(outside.getAttribute('aria-hidden')).toBe('true');

            // Tab past the end of the popup: the after guard sends the focus back into the popup.
            after?.focus();
            await tick();
            await tick();
            expect(popup.contains(document.activeElement)).toBe(true);

            close.click();
            await tick();
            expect(guards(positioner).every((guard) => guard.hidden)).toBe(true);
        });
    });

    describe('nested', () => {
        function mountNested() {
            const container = document.createElement('div');
            container.innerHTML = `
                <ui-popover id="outer">
                    <ui-popover-trigger>Outer</ui-popover-trigger>
                    <ui-popover-positioner>
                        <ui-popover-popup>
                            <ui-popover id="inner">
                                <ui-popover-trigger>Inner</ui-popover-trigger>
                                <ui-popover-positioner>
                                    <ui-popover-popup><button id="inside-inner">Inside</button></ui-popover-popup>
                                </ui-popover-positioner>
                            </ui-popover>
                        </ui-popover-popup>
                    </ui-popover-positioner>
                </ui-popover>
                <button id="page">Page</button>`;
            document.body.append(container);
            const triggers = container.querySelectorAll('ui-popover-trigger');
            return {
                outerTrigger: triggers[0] as HTMLElement,
                innerTrigger: triggers[1] as HTMLElement,
                insideInner: container.querySelector('#inside-inner') as HTMLElement,
                page: container.querySelector('#page') as HTMLElement
            };
        }

        const press = (element: Element) => {
            element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0 }));
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true, button: 0 }));
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, button: 0 }));
        };

        it('keeps the parent open while pressing inside the child, and closes both outside', async () => {
            const { outerTrigger, innerTrigger, insideInner, page } = mountNested();
            await tick();
            outerTrigger.click();
            await tick();
            innerTrigger.click();
            await tick();
            expect(innerTrigger.getAttribute('aria-expanded')).toBe('true');

            press(insideInner);
            await tick();
            expect(outerTrigger.getAttribute('aria-expanded')).toBe('true');
            expect(innerTrigger.getAttribute('aria-expanded')).toBe('true');

            press(page);
            await tick();
            expect(innerTrigger.getAttribute('aria-expanded')).toBe('false');
            expect(outerTrigger.getAttribute('aria-expanded')).toBe('false');
        });

        it('closes only the child on Escape', async () => {
            const { outerTrigger, innerTrigger, insideInner } = mountNested();
            await tick();
            outerTrigger.click();
            await tick();
            innerTrigger.click();
            await tick();

            insideInner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
            await tick();
            expect(innerTrigger.getAttribute('aria-expanded')).toBe('false');
            expect(outerTrigger.getAttribute('aria-expanded')).toBe('true');
        });
    });
});
