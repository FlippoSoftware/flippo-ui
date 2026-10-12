import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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

function mount(rootAttributes = '', triggerAttributes = 'delay="0" close-delay="0"', wrapper = (markup: string) => markup) {
    const container = document.createElement('div');
    container.innerHTML = wrapper(`
        <ui-tooltip ${rootAttributes}>
            <ui-tooltip-trigger ${triggerAttributes} as-child><button>Save</button></ui-tooltip-trigger>
            <ui-tooltip-positioner side-offset="4">
                <ui-tooltip-popup>Saves the document<ui-tooltip-arrow></ui-tooltip-arrow></ui-tooltip-popup>
            </ui-tooltip-positioner>
        </ui-tooltip>`);
    document.body.append(container);
    return {
        root: container.querySelector('ui-tooltip') as HTMLElement & { open?: boolean },
        button: container.querySelector('button') as HTMLButtonElement,
        positioner: container.querySelector('ui-tooltip-positioner') as HTMLElement,
        popup: container.querySelector('ui-tooltip-popup') as HTMLElement,
        arrow: container.querySelector('ui-tooltip-arrow') as HTMLElement
    };
}

const hover = (element: Element) => {
    element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    element.dispatchEvent(new MouseEvent('mouseenter'));
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
};

const leave = (element: Element) => {
    element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    element.dispatchEvent(new MouseEvent('mouseleave'));
};

describe('tooltip', () => {
    it('opens on focus into the top layer and describes the trigger', async () => {
        const { root, button, positioner, popup, arrow } = mount();
        await tick();
        expect(topLayer.has(positioner)).toBe(false);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        root.addEventListener('open-change', onChange);
        button.focus();
        button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        await tick();

        expect(onChange).toHaveReturnedWith(expect.objectContaining({ open: true }));
        expect(topLayer.has(positioner)).toBe(true);
        expect(positioner.getAttribute('data-side')).toBe('top');
        expect(button.hasAttribute('data-popup-open')).toBe(true);
        expect(popup.hasAttribute('data-open')).toBe(true);
        expect(arrow.getAttribute('aria-hidden')).toBe('true');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await tick();
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('opens on hover and closes when the pointer leaves', async () => {
        const { button, positioner } = mount('disable-hoverable-popup');
        await tick();
        hover(button);
        await tick();
        expect(topLayer.has(positioner)).toBe(true);

        leave(button);
        await tick();
        await tick();
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('does not open when disabled', async () => {
        const { button, positioner } = mount('disabled');
        await tick();
        hover(button);
        button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        await tick();
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('follows a controlled `open`', async () => {
        const { root, positioner } = mount('open');
        await tick();
        expect(topLayer.has(positioner)).toBe(true);
        root.open = false;
        await tick();
        expect(topLayer.has(positioner)).toBe(false);
    });

    it('takes the delays of the provider around it', async () => {
        vi.useFakeTimers();
        try {
            const { button, positioner } = mount('', '', (markup) => `<ui-tooltip-provider delay="300">${markup}</ui-tooltip-provider>`);
            await vi.advanceTimersByTimeAsync(0);
            hover(button);
            await vi.advanceTimersByTimeAsync(200);
            expect(topLayer.has(positioner)).toBe(false);
            await vi.advanceTimersByTimeAsync(200);
            expect(topLayer.has(positioner)).toBe(true);
        } finally {
            vi.useRealTimers();
        }
    });
});
