import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import type { App } from 'vue';

import { define } from '../src';

import { stubPopoverApi } from './stubPopoverApi';

const tick = async () => {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
};

let container: HTMLElement;
let app: App | null = null;

beforeAll(() => {
    (globalThis as { FLIPPO_UI_ANIMATIONS_DISABLED?: boolean }).FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

function mount(component: ReturnType<typeof defineComponent>) {
    container = document.createElement('div');
    document.body.append(container);
    app = createApp(component);
    app.mount(container);
}

afterEach(() => {
    app?.unmount();
    app = null;
    container.remove();
});

describe('Vue 3', () => {
    it('controls a toggle with a property and listens to its kebab-case event', async () => {
        const onChange = vi.fn();
        const pressed = ref(false);
        mount(
            defineComponent({
                setup: () => () =>
                    h(
                        'ui-toggle',
                        {
                            pressed: pressed.value,
                            // `@pressed-change` in a template.
                            onPressedChange: (event: CustomEvent<{ pressed: boolean }>) => {
                                onChange(event.detail.pressed);
                                pressed.value = event.detail.pressed;
                            }
                        },
                        'Bold'
                    )
            })
        );
        await tick();
        const toggle = container.querySelector('ui-toggle') as HTMLElement & { pressed?: boolean };
        expect(toggle.pressed).toBe(false);
        expect(toggle.getAttribute('aria-pressed')).toBe('false');

        toggle.click();
        await tick();
        expect(onChange).toHaveBeenCalledWith(true);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
    });

    it('keeps `as-child` working when Vue re-renders the child', async () => {
        const label = ref('B');
        mount(
            defineComponent({
                setup: () => () => h('ui-toggle', { 'as-child': '' }, [h('button', { class: 'bold' }, label.value)])
            })
        );
        await tick();
        const button = container.querySelector('button') as HTMLButtonElement;
        button.click();
        await tick();
        expect(button.getAttribute('aria-pressed')).toBe('true');

        label.value = 'Bold';
        await tick();
        expect(button.textContent).toBe('Bold');
        expect(button.getAttribute('aria-pressed')).toBe('true');
    });

    it('renders a collapsible whose panel Vue fills', async () => {
        const text = ref('First');
        mount(
            defineComponent({
                setup: () => () =>
                    h('ui-collapsible', null, [h('ui-collapsible-trigger', null, 'More'), h('ui-collapsible-panel', null, text.value)])
            })
        );
        await tick();
        const trigger = container.querySelector('ui-collapsible-trigger') as HTMLElement;
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        trigger.click();
        await tick();
        expect(panel.hidden).toBe(false);

        text.value = 'Second';
        await tick();
        expect(panel.textContent).toBe('Second');
        expect(panel.hidden).toBe(false);
    });

    it('re-renders the content of an open popover in place', async () => {
        const { topLayer: shown, restore } = stubPopoverApi();
        const count = ref(1);
        mount(
            defineComponent({
                setup: () => () =>
                    h('ui-popover', null, [
                        h('ui-popover-trigger', null, 'Open'),
                        h('ui-popover-positioner', null, [
                            h('ui-popover-popup', null, [h('span', { class: 'count' }, String(count.value))])
                        ])
                    ])
            })
        );
        await tick();
        const trigger = container.querySelector('ui-popover-trigger') as HTMLElement;
        const positioner = container.querySelector('ui-popover-positioner') as HTMLElement;
        trigger.click();
        await tick();
        expect(shown.has(positioner)).toBe(true);

        count.value = 2;
        await tick();
        expect(positioner.parentElement?.localName).toBe('ui-popover');
        expect(container.querySelector('.count')?.textContent).toBe('2');
        expect(shown.has(positioner)).toBe(true);

        restore();
    });
});
