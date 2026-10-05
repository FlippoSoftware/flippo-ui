export type Listener<State> = (state: State) => void;

let deferDepth = 0;

const deferredStores = new Set<Store<unknown>>();

/**
 * Runs `fn` with listener notifications deferred: state changes apply immediately (`store.state` is
 * up to date), but listeners are only called by {@link flushNotifications}.
 *
 * Framework adapters use it to push options into machines while rendering, when notifying other
 * components is not allowed, and flush once the render is committed.
 */
export function deferNotifications<T>(fn: () => T): T {
    deferDepth += 1;
    try {
        return fn();
    } finally {
        deferDepth -= 1;
    }
}

/**
 * Notifies the listeners of every store changed inside {@link deferNotifications}, once per store
 * with its latest state. Does nothing while a deferral is still running.
 */
export function flushNotifications() {
    if (deferDepth > 0) {
        return;
    }
    while (deferredStores.size > 0) {
        const stores = [...deferredStores];
        deferredStores.clear();
        for (const store of stores) {
            store.notifyListeners();
        }
    }
}

/**
 * A data store implementation that allows subscribing to state changes and updating the state.
 * It uses an observer pattern to notify subscribers when the state changes.
 */
export class Store<State> {
    /**
     * The current state of the store.
     * This property is updated immediately when the state changes as a result of calling {@link setState}, {@link update}, or {@link set}.
     *
     * Do not modify properties in state directly. Instead, use the provided methods to ensure proper state management
     * and listener notification.
     */
    public state: State;

    private readonly listeners: Set<Listener<State>>;

    // Internal state to handle recursive `setState()` calls
    private updateTick: number;

    constructor(state: State) {
        this.state = state;
        this.listeners = new Set();
        this.updateTick = 0;
    }

    /**
     * Registers a listener that will be called whenever the store's state changes.
     *
     * @param fn The listener function to be called on state changes.
     * @returns A function to unsubscribe the listener.
     */
    public subscribe = (fn: Listener<State>) => {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    };

    /**
     * Returns the current state of the store.
     */
    public getSnapshot = () => {
        return this.state;
    };

    /**
     * Updates the entire store's state and notifies all registered listeners.
     *
     * @param newState The new state to set for the store.
     */
    public setState(newState: State) {
        if (this.state === newState) {
            return;
        }

        this.state = newState;
        this.updateTick += 1;

        if (deferDepth > 0) {
            deferredStores.add(this as Store<unknown>);
            return;
        }

        this.notifyListeners();
    }

    /**
     * Calls the listeners with the current state.
     *
     * @internal Used by {@link flushNotifications}; use the state setters instead.
     */
    notifyListeners() {
        const newState = this.state;
        const currentTick = this.updateTick;
        for (const listener of this.listeners) {
            if (currentTick !== this.updateTick) {
                // If the tick has changed, a recursive `setState` call has been made,
                // and it has already notified all listeners.
                return;
            }
            listener(newState);
        }
    }

    /**
     * Merges the provided changes into the current state and notifies listeners if there are changes.
     *
     * @param changes An object containing the changes to apply to the current state.
     */
    public update(changes: Partial<State>) {
        for (const key in changes) {
            if (!Object.is(this.state[key], changes[key])) {
                Store.prototype.setState.call(this, { ...this.state, ...changes });
                return;
            }
        }
    }

    /**
     * Sets a specific key in the store's state to a new value and notifies listeners if the value has changed.
     *
     * @param key The key in the store's state to update.
     * @param value The new value to set for the specified key.
     */
    public set<Key extends keyof State>(key: Key, value: State[Key]) {
        if (!Object.is(this.state[key], value)) {
            Store.prototype.setState.call(this, { ...this.state, [key]: value });
        }
    }

    /**
     * Gives the state a new reference and updates all registered listeners.
     */
    public notifyAll() {
        const newState = { ...this.state };
        Store.prototype.setState.call(this, newState);
    }
}
