/**
 * Lifecycle shared by machines, controllers and interactions.
 *
 * Constructors only set up state: no subscriptions to stores they don't own, no DOM listeners,
 * timers or animation frames. That work happens in {@link Connectable.onConnect}, started by
 * {@link Connectable.connect} and undone by {@link Connectable.disconnect}. This makes instances:
 * - safe to create during a server render (nothing touches the DOM until connected);
 * - reconnectable, as React StrictMode does (mount → unmount → mount the same instance).
 *
 * While disconnected, `setOptions`-like methods only store their input; implementations re-sync
 * in `onConnect`.
 */
export abstract class Connectable {
    private cleanups: (() => void)[] = [];

    private isConnected = false;

    /**
     * Whether the instance is connected (subscriptions and listeners are active).
     */
    get connected(): boolean {
        return this.isConnected;
    }

    /**
     * Starts subscriptions and side effects. Calling it again while connected does nothing.
     *
     * @returns {@link Connectable.disconnect}, so it can be returned from an effect.
     */
    connect = (): (() => void) => {
        if (!this.isConnected) {
            this.isConnected = true;
            this.onConnect();
        }
        return this.disconnect;
    };

    /**
     * Stops subscriptions and side effects. The instance can be connected again.
     */
    disconnect = (): void => {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        const cleanups = this.cleanups;
        this.cleanups = [];
        for (let i = cleanups.length - 1; i >= 0; i -= 1) {
            cleanups[i]?.();
        }
        this.onDisconnect();
    };

    /**
     * Same as {@link Connectable.disconnect}; kept for call sites that end an instance's life.
     */
    destroy(): void {
        this.disconnect();
    }

    /**
     * Registers a cleanup run (in reverse order) on disconnect. Only call it while connected.
     */
    protected addCleanup(cleanup: () => void): void {
        this.cleanups.push(cleanup);
    }

    /**
     * Connects a child and disconnects it with this instance.
     */
    protected connectChild(child: Connectable): void {
        this.addCleanup(child.connect());
    }

    /**
     * Subscribes and starts side effects. Use {@link Connectable.addCleanup} for what must be undone.
     */
    protected onConnect(): void {}

    /**
     * Releases resources not registered with {@link Connectable.addCleanup} (effects, timers, lazily created children).
     */
    protected onDisconnect(): void {}
}
