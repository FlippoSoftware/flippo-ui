import React from 'react';

import { act, createRenderer, fireEvent, screen } from '@flippo-software/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Marquee } from '.';

/**
 * jsdom has no layout: the root measures `containerSize` and the hidden measurement copy `contentSize`.
 */
const sizes = { container: 300, content: 100 };

class FakeResizeObserver {
    static instances: FakeResizeObserver[] = [];

    readonly callback: () => void;

    readonly targets = new Set<Element>();

    constructor(callback: () => void) {
        this.callback = callback;
        FakeResizeObserver.instances.push(this);
    }

    observe(target: Element) {
        this.targets.add(target);
    }

    unobserve(target: Element) {
        this.targets.delete(target);
    }

    disconnect() {
        this.targets.clear();
    }

    static resize() {
        act(() => {
            for (const instance of FakeResizeObserver.instances) {
                if (instance.targets.size > 0) {
                    instance.callback();
                }
            }
        });
    }
}

function rect(width: number) {
    return DOMRect.fromRect({ x: 0, y: 0, width, height: width / 10 });
}

describe.each(RENDER_MODES)('Marquee ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    beforeEach(() => {
        sizes.container = 300;
        sizes.content = 100;
        FakeResizeObserver.instances = [];
        vi.stubGlobal('ResizeObserver', FakeResizeObserver);
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid === 'root') {
                return rect(sizes.container);
            }
            if (this.getAttribute('aria-hidden') === 'true' && this.parentElement?.dataset.testid === 'root') {
                return rect(sizes.content);
            }
            return rect(0);
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    function copies() {
        return screen.getAllByText('Item').length;
    }

    function TestMarquee(props: Partial<Marquee.Root.Props>) {
        return (
            <Marquee.Root data-testid='root' {...props}>
                <Marquee.Track data-testid='track'>
                    <span>Item</span>
                </Marquee.Track>
            </Marquee.Root>
        );
    }

    it('exposes the state as data attributes and sets functional styles', () => {
        render(<TestMarquee />);
        const root = screen.getByTestId('root');
        expect(root).toHaveAttribute('data-orientation', 'horizontal');
        expect(root).toHaveAttribute('data-direction', 'normal');
        expect(root).toHaveAttribute('data-playing', '');
        expect(root.style.overflow).toBe('hidden');
        expect(root.style.flexDirection).toBe('row');
        expect(root.style.getPropertyValue('--marquee-play')).toBe('running');
        expect(root.style.getPropertyValue('--marquee-pause-on-hover')).toBe('paused');
        expect(root.style.getPropertyValue('--marquee-iteration-count')).toBe('infinite');
    });

    it('repeats the content to fill the container and derives the duration', () => {
        render(<TestMarquee speed={50} />);
        // One hidden measurement copy plus two animated tracks of three copies each.
        expect(copies()).toBe(1 + 2 * 3);
        expect(screen.getByTestId('root').style.getPropertyValue('--marquee-duration')).toBe('6s');
    });

    it('measures again when the container resizes', () => {
        render(<TestMarquee />);
        sizes.container = 500;
        FakeResizeObserver.resize();
        expect(copies()).toBe(1 + 2 * 5);
    });

    it('does not repeat the content without autoFill', () => {
        render(<TestMarquee autoFill={false} speed={100} />);
        expect(copies()).toBe(1 + 2);
        // The content is narrower than the container: the duration follows the container.
        expect(screen.getByTestId('root').style.getPropertyValue('--marquee-duration')).toBe('3s');
    });

    it('follows the play, orientation and loop props', () => {
        const { rerender } = render(<TestMarquee />);
        rerender(<TestMarquee play={false} orientation='vertical' direction='reverse' loop={2} delay={1} />);
        const root = screen.getByTestId('root');
        expect(root).not.toHaveAttribute('data-playing');
        expect(root).toHaveAttribute('data-orientation', 'vertical');
        expect(root).toHaveAttribute('data-direction', 'reverse');
        expect(root.style.flexDirection).toBe('column');
        expect(root.style.getPropertyValue('--marquee-play')).toBe('paused');
        expect(root.style.getPropertyValue('--marquee-iteration-count')).toBe('2');
        expect(root.style.getPropertyValue('--marquee-delay')).toBe('1s');
    });

    it('calls onMount once and forwards animation events of the track', () => {
        const onMount = vi.fn();
        const onCycleComplete = vi.fn();
        const onFinish = vi.fn();
        render(<TestMarquee onMount={onMount} onCycleComplete={onCycleComplete} onFinish={onFinish} />);
        expect(onMount).toHaveBeenCalledTimes(reactStrictMode ? 2 : 1);

        const [track] = screen.getAllByTestId('track');
        fireEvent.animationIteration(track as HTMLElement);
        fireEvent.animationEnd(track as HTMLElement);
        expect(onCycleComplete).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledTimes(1);
    });
});
