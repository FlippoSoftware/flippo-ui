import React, { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { stubPopoverApi } from './stubPopoverApi';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ui-toggle': Record<string, unknown> & { children?: React.ReactNode };
            'ui-collapsible': Record<string, unknown> & { children?: React.ReactNode };
            'ui-collapsible-trigger': Record<string, unknown> & { children?: React.ReactNode };
            'ui-collapsible-panel': Record<string, unknown> & { children?: React.ReactNode };
            'ui-popover': Record<string, unknown> & { children?: React.ReactNode };
            'ui-popover-trigger': Record<string, unknown> & { children?: React.ReactNode };
            'ui-popover-positioner': Record<string, unknown> & { children?: React.ReactNode };
            'ui-popover-popup': Record<string, unknown> & { children?: React.ReactNode };
        }
    }
}

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve)));

let container: HTMLElement;
let root: Root;

beforeAll(() => {
    (globalThis as { FLIPPO_UI_ANIMATIONS_DISABLED?: boolean }).FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

function render(element: React.ReactNode) {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(element));
}

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

describe('React 19', () => {
    it('controls a toggle with a property and listens to its event', async () => {
        const onChange = vi.fn();

        function Controlled() {
            const [pressed, setPressed] = React.useState(false);
            return (
                <ui-toggle
                    pressed={pressed}
                    onpressed-change={(event: CustomEvent<{ pressed: boolean }>) => {
                        onChange(event.detail.pressed);
                        setPressed(event.detail.pressed);
                    }}
                >
                    Bold
                </ui-toggle>
            );
        }

        render(<Controlled />);
        await tick();
        const toggle = container.querySelector('ui-toggle') as HTMLElement & { pressed?: boolean };
        // React 19 sets it as a property, not as the string "false".
        expect(toggle.pressed).toBe(false);
        expect(toggle.getAttribute('aria-pressed')).toBe('false');

        act(() => toggle.click());
        await tick();
        expect(onChange).toHaveBeenCalledWith(true);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
    });

    it('keeps `as-child` working when React re-renders the child', async () => {
        function WithChild({ label }: { label: string }) {
            return (
                <ui-toggle as-child=''>
                    <button type='button' className='bold'>
                        {label}
                    </button>
                </ui-toggle>
            );
        }

        render(<WithChild label='B' />);
        await tick();
        const button = container.querySelector('button') as HTMLButtonElement;
        act(() => button.click());
        await tick();
        expect(button.getAttribute('aria-pressed')).toBe('true');

        // React updates its own props of the child; the toggle's attributes stay.
        act(() => root.render(<WithChild label='Bold' />));
        await tick();
        expect(button.textContent).toBe('Bold');
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(button.className).toBe('bold');
    });

    it('renders a collapsible whose panel React fills', async () => {
        function Disclosure({ text }: { text: string }) {
            return (
                <ui-collapsible>
                    <ui-collapsible-trigger>More</ui-collapsible-trigger>
                    <ui-collapsible-panel>{text}</ui-collapsible-panel>
                </ui-collapsible>
            );
        }

        render(<Disclosure text='First' />);
        await tick();
        const trigger = container.querySelector('ui-collapsible-trigger') as HTMLElement;
        const panel = container.querySelector('ui-collapsible-panel') as HTMLElement;
        expect(panel.hidden).toBe(true);

        act(() => trigger.click());
        await tick();
        expect(panel.hidden).toBe(false);

        act(() => root.render(<Disclosure text='Second' />));
        await tick();
        expect(panel.textContent).toBe('Second');
        expect(panel.hidden).toBe(false);
    });

    it('re-renders the content of an open popover in place', async () => {
        const { topLayer: shown, restore } = stubPopoverApi();

        function Menu({ count }: { count: number }) {
            return (
                <ui-popover>
                    <ui-popover-trigger>Open</ui-popover-trigger>
                    <ui-popover-positioner>
                        <ui-popover-popup>
                            <span className='count'>{count}</span>
                        </ui-popover-popup>
                    </ui-popover-positioner>
                </ui-popover>
            );
        }

        render(<Menu count={1} />);
        await tick();
        const trigger = container.querySelector('ui-popover-trigger') as HTMLElement;
        const positioner = container.querySelector('ui-popover-positioner') as HTMLElement;
        act(() => trigger.click());
        await tick();
        expect(shown.has(positioner)).toBe(true);

        act(() => root.render(<Menu count={2} />));
        await tick();
        // The positioner is still where React rendered it, so React can update it.
        expect(positioner.parentElement?.localName).toBe('ui-popover');
        expect(container.querySelector('.count')?.textContent).toBe('2');
        expect(shown.has(positioner)).toBe(true);

        restore();
    });
});
