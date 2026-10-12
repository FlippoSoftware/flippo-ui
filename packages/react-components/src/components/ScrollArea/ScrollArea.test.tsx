import React from 'react';

import { act, createRenderer, fireEvent, screen } from '@flippo-software/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { ScrollArea } from '.';

/**
 * jsdom has no layout: the viewport (`data-testid="viewport"`) reports these scroll metrics.
 */
const metrics = {
    scrollHeight: 500,
    clientHeight: 100,
    scrollWidth: 100,
    clientWidth: 100,
    scrollTop: 0,
    scrollLeft: 0
};

type Metric = keyof typeof metrics;

const METRIC_KEYS: Metric[] = ['scrollHeight', 'clientHeight', 'scrollWidth', 'clientWidth', 'scrollTop', 'scrollLeft'];

function isViewport(element: Element) {
    return (element as HTMLElement).dataset?.testid === 'viewport';
}

function stubViewportMetrics() {
    const originals = new Map<Metric, PropertyDescriptor | undefined>();
    for (const key of METRIC_KEYS) {
        const original = Object.getOwnPropertyDescriptor(Element.prototype, key);
        originals.set(key, original);
        Object.defineProperty(Element.prototype, key, {
            configurable: true,
            get(this: Element) {
                return isViewport(this) ? metrics[key] : (original?.get?.call(this) ?? 0);
            },
            set(this: Element, value: number) {
                if (isViewport(this)) {
                    metrics[key] = value;
                } else {
                    original?.set?.call(this, value);
                }
            }
        });
    }
    return () => {
        for (const [key, descriptor] of originals) {
            if (descriptor) {
                Object.defineProperty(Element.prototype, key, descriptor);
            }
        }
    };
}

/**
 * Lets the deferred thumb computation (microtask after layout effects) run.
 */
async function settle() {
    await act(async () => {
        await Promise.resolve();
    });
}

describe.each(RENDER_MODES)('ScrollArea ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    let restoreMetrics: () => void;

    beforeEach(() => {
        Object.assign(metrics, { scrollHeight: 500, clientHeight: 100, scrollWidth: 100, clientWidth: 100, scrollTop: 0, scrollLeft: 0 });
        restoreMetrics = stubViewportMetrics();
    });

    afterEach(() => {
        restoreMetrics();
        vi.useRealTimers();
    });

    function TestScrollArea(props: { keepMounted?: boolean }) {
        return (
            <ScrollArea.Root data-testid='root'>
                <ScrollArea.Viewport data-testid='viewport'>
                    <ScrollArea.Content data-testid='content'>Content</ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar data-testid='scrollbar-y' orientation='vertical'>
                    <ScrollArea.Thumb data-testid='thumb-y' />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar data-testid='scrollbar-x' orientation='horizontal' keepMounted={props.keepMounted}>
                    <ScrollArea.Thumb data-testid='thumb-x' />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner data-testid='corner' />
            </ScrollArea.Root>
        );
    }

    it('renders presentational parts with functional styles', async () => {
        render(<TestScrollArea />);
        await settle();
        const root = screen.getByTestId('root');
        const viewport = screen.getByTestId('viewport');
        expect(root).toHaveAttribute('role', 'presentation');
        expect(root.style.position).toBe('relative');
        expect(viewport).toHaveAttribute('role', 'presentation');
        expect(viewport.style.overflow).toBe('scroll');
        expect(screen.getByTestId('content')).toHaveAttribute('role', 'presentation');
        expect(screen.getByTestId('content').style.minWidth).toBe('fit-content');
    });

    it('shows only the scrollbar of the overflowing axis', async () => {
        render(<TestScrollArea />);
        await settle();
        const root = screen.getByTestId('root');
        expect(root).toHaveAttribute('data-has-overflow-y', '');
        expect(root).not.toHaveAttribute('data-has-overflow-x');
        expect(screen.getByTestId('scrollbar-y')).toHaveAttribute('data-orientation', 'vertical');
        expect(screen.queryByTestId('scrollbar-x')).toBeNull();
        expect(screen.queryByTestId('corner')).toBeNull();
        // A scrollable region must be focusable.
        expect(screen.getByTestId('viewport')).toHaveAttribute('tabindex', '0');
        expect(screen.getByTestId('thumb-y').style.height).toBe('var(--scroll-area-thumb-height)');
    });

    it('keeps a hidden scrollbar mounted with keepMounted', async () => {
        render(<TestScrollArea keepMounted={true} />);
        await settle();
        expect(screen.getByTestId('scrollbar-x')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('hides both scrollbars and the tab stop without overflow', async () => {
        metrics.scrollHeight = 100;
        render(<TestScrollArea />);
        await settle();
        expect(screen.queryByTestId('scrollbar-y')).toBeNull();
        expect(screen.queryByTestId('scrollbar-x')).toBeNull();
        expect(screen.getByTestId('viewport')).not.toHaveAttribute('tabindex');
        expect(screen.getByTestId('root')).not.toHaveAttribute('data-has-overflow-y');
    });

    it('shows the corner when both axes overflow', async () => {
        metrics.scrollWidth = 400;
        render(<TestScrollArea />);
        await settle();
        expect(screen.getByTestId('scrollbar-x')).toBeInTheDocument();
        expect(screen.getByTestId('corner')).toBeInTheDocument();
        expect(screen.getByTestId('root')).toHaveAttribute('data-has-overflow-x', '');
    });

    it('tracks the overflow edges while scrolling', async () => {
        render(<TestScrollArea />);
        await settle();
        const root = screen.getByTestId('root');
        const viewport = screen.getByTestId('viewport');
        expect(root).not.toHaveAttribute('data-overflow-y-start');
        expect(root).toHaveAttribute('data-overflow-y-end', '');
        expect(viewport.style.getPropertyValue('--scroll-area-overflow-y-end')).toBe('400px');

        metrics.scrollTop = 400;
        fireEvent.scroll(viewport);
        await settle();
        expect(root).toHaveAttribute('data-overflow-y-start', '');
        expect(root).not.toHaveAttribute('data-overflow-y-end');
        expect(viewport.style.getPropertyValue('--scroll-area-overflow-y-start')).toBe('400px');
    });

    it('marks user scrolling until it settles', async () => {
        render(<TestScrollArea />);
        await settle();
        vi.useFakeTimers();
        const viewport = screen.getByTestId('viewport');

        fireEvent.wheel(viewport);
        metrics.scrollTop = 50;
        fireEvent.scroll(viewport);
        expect(screen.getByTestId('root')).toHaveAttribute('data-scrolling', '');
        expect(screen.getByTestId('scrollbar-y')).toHaveAttribute('data-scrolling', '');

        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(screen.getByTestId('root')).not.toHaveAttribute('data-scrolling');
    });

    it('does not mark programmatic scrolling', async () => {
        render(<TestScrollArea />);
        await settle();
        metrics.scrollTop = 50;
        fireEvent.scroll(screen.getByTestId('viewport'));
        expect(screen.getByTestId('root')).not.toHaveAttribute('data-scrolling');
    });

    it('marks scrollbars as hovered while the pointer is inside', async () => {
        render(<TestScrollArea />);
        await settle();
        const root = screen.getByTestId('root');
        fireEvent.pointerEnter(root, { pointerType: 'mouse' });
        expect(screen.getByTestId('scrollbar-y')).toHaveAttribute('data-hovering', '');
        fireEvent.pointerLeave(root, { pointerType: 'mouse' });
        expect(screen.getByTestId('scrollbar-y')).not.toHaveAttribute('data-hovering');
    });
});
