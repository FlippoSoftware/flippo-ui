import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AnimationFrame } from './AnimationFrame';
import { Timeout } from './Timeout';

describe('Timeout', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('runs the latest scheduled call only', () => {
        const timeout = Timeout.create();
        const first = vi.fn();
        const second = vi.fn();

        timeout.start(100, first);
        timeout.start(100, second);
        expect(timeout.isStarted()).toBe(true);

        vi.advanceTimersByTime(100);
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
        expect(timeout.isStarted()).toBe(false);
    });

    it('clears through the dispose effect', () => {
        const timeout = new Timeout();
        const fn = vi.fn();
        timeout.start(50, fn);
        timeout.disposeEffect()();
        vi.advanceTimersByTime(50);
        expect(fn).not.toHaveBeenCalled();
        timeout.clear();
    });
});

describe('AnimationFrame', () => {
    it('runs the latest request on the next frame', async () => {
        const frame = AnimationFrame.create();
        const first = vi.fn();
        const second = vi.fn();

        frame.request(first);
        frame.request(second);

        await new Promise<void>((resolve) => {
            AnimationFrame.request(() => resolve());
        });

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
        expect(frame.currentId).toBeNull();
    });

    it('cancels requests', async () => {
        const frame = new AnimationFrame();
        const fn = vi.fn();
        frame.request(fn);
        frame.disposeEffect()();

        const id = AnimationFrame.request(fn);
        AnimationFrame.cancel(id);
        AnimationFrame.cancel(id);
        AnimationFrame.cancel(null);

        await new Promise<void>((resolve) => {
            AnimationFrame.request(() => resolve());
        });

        expect(fn).not.toHaveBeenCalled();
    });

    it('does not run a callback cancelled by an earlier callback of the same frame', async () => {
        const second = vi.fn();
        let secondId: ReturnType<typeof AnimationFrame.request> | null = null;
        AnimationFrame.request(() => AnimationFrame.cancel(secondId));
        secondId = AnimationFrame.request(second);

        await nextFrame();
        expect(second).not.toHaveBeenCalled();

        // The same through instances.
        const a = new AnimationFrame();
        const b = new AnimationFrame();
        const bFn = vi.fn();
        a.request(() => b.cancel());
        b.request(bFn);
        await nextFrame();
        expect(bFn).not.toHaveBeenCalled();
    });

    it('ignores stale handles from frames that already ran', async () => {
        const first = AnimationFrame.request(() => {});
        await nextFrame();

        const fn = vi.fn();
        AnimationFrame.request(fn);
        AnimationFrame.cancel(first);
        await nextFrame();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('queues requests made inside a callback for the next frame', async () => {
        const order: string[] = [];
        AnimationFrame.request(() => {
            order.push('outer');
            AnimationFrame.request(() => order.push('inner'));
        });
        await nextFrame();
        expect(order).toEqual(['outer']);
        await nextFrame();
        expect(order).toEqual(['outer', 'inner']);
    });

    it('requests one native frame per batch', async () => {
        await nextFrame();
        const spy = vi.spyOn(globalThis, 'requestAnimationFrame');
        const fns = [vi.fn(), vi.fn(), vi.fn()];
        for (const fn of fns) {
            AnimationFrame.request(fn);
        }
        expect(spy).toHaveBeenCalledTimes(1);
        spy.mockRestore();
        await nextFrame();
        for (const fn of fns) {
            expect(fn).toHaveBeenCalledTimes(1);
        }
    });
});

function nextFrame() {
    return new Promise<void>((resolve) => {
        AnimationFrame.request(() => resolve());
    });
}
