/**
 * Handle of a scheduled frame callback. Cancelling sets `callback` to `null`.
 * A handle only ever refers to its own callback, so cancelling a stale handle (from a frame that
 * already ran) is a no-op and can't affect other callbacks.
 */
export type AnimationFrameId = {
    callback: FrameRequestCallback | null;
};

/**
 * Internal handle: also remembers the batch (queue) it was requested in.
 */
type FrameHandle = AnimationFrameId & {
    queue: FrameHandle[];
};

let LAST_RAF: typeof globalThis.requestAnimationFrame | undefined = globalThis.requestAnimationFrame;

class Scheduler {
    /* All callbacks requested before the next frame share one native `requestAnimationFrame`.
     * Cancelling clears the handle's callback in `O(1)` and never calls the native
     * `cancelAnimationFrame`: with a "request-cancel-request-cancel-…" pattern the native frame is
     * reused, and when everything was cancelled the frame runs as an `O(1)` no-op via `pendingCount`.
     * Handles are objects rather than counters, so there is nothing to overflow. */

    queue: FrameHandle[] = [];

    pendingCount = 0;

    isScheduled = false;

    tick = (timestamp: number) => {
        this.isScheduled = false;

        const currentQueue = this.queue;
        const currentPendingCount = this.pendingCount;

        // Reset before running the callbacks: they may request new frames (queued for the next tick).
        this.queue = [];
        this.pendingCount = 0;

        if (currentPendingCount === 0) {
            return;
        }

        for (const handle of currentQueue) {
            // Read the callback right before running it: an earlier callback of this frame may have cancelled it.
            const callback = handle.callback;
            if (callback !== null) {
                handle.callback = null;
                callback(timestamp);
            }
        }
    };

    request(fn: FrameRequestCallback): AnimationFrameId {
        const handle: FrameHandle = { callback: fn, queue: this.queue };
        this.queue.push(handle);
        this.pendingCount += 1;

        /* In a test environment with fake timers, a fake `requestAnimationFrame` can be called
         * but there's no guarantee that the animation frame will actually run before the fake
         * timers are teared down, which leaves `isScheduled` set but never runs our `tick()`. */
        let didRAFChange = false;
        if (process.env.NODE_ENV === 'test' && LAST_RAF !== globalThis.requestAnimationFrame) {
            LAST_RAF = globalThis.requestAnimationFrame;
            didRAFChange = true;
        }

        if (!this.isScheduled || didRAFChange) {
            globalThis.requestAnimationFrame(this.tick);
            this.isScheduled = true;
        }

        return handle;
    }

    cancel(handle: AnimationFrameId | null | undefined) {
        if (handle == null || handle.callback === null) {
            return;
        }

        handle.callback = null;
        // Only the pending batch is counted; a handle of the frame being run was counted in the previous batch.
        if ((handle as FrameHandle).queue === this.queue) {
            this.pendingCount -= 1;
        }
    }
}

const scheduler = new Scheduler();

/**
 * A `requestAnimationFrame` wrapper that keeps at most one pending call.
 * All instances share one native animation frame per tick.
 */
export class AnimationFrame {
    static create() {
        return new AnimationFrame();
    }

    static request(fn: FrameRequestCallback): AnimationFrameId {
        return scheduler.request(fn);
    }

    static cancel(handle: AnimationFrameId | null | undefined) {
        scheduler.cancel(handle);
    }

    currentId: AnimationFrameId | null = null;

    /**
     * Executes `fn` on the next frame, clearing any previously scheduled call.
     */
    request(fn: () => void) {
        this.cancel();
        this.currentId = scheduler.request(() => {
            this.currentId = null;
            fn();
        });
    }

    cancel = () => {
        if (this.currentId !== null) {
            scheduler.cancel(this.currentId);
            this.currentId = null;
        }
    };

    /**
     * Returns the cleanup, so it can be used directly as an effect.
     */
    disposeEffect = () => {
        return this.cancel;
    };
}
