/**
 * Called with the new state after a store (or the value of a computed value) changes.
 */
export type Listener<State> = (state: State) => void;

/**
 * A readable source of state: a {@link Store} or a computed value.
 */
export interface ReadableStore<State> {
    /**
     * The current state. Reading it inside a computed value, an effect or a tracked function makes them depend on
     * this source.
     */
    readonly state: State;
    /**
     * Returns the current state.
     */
    getSnapshot(): State;
    /**
     * Registers a listener called after the state changes. Returns a function to unsubscribe it.
     */
    subscribe(listener: Listener<State>): () => void;
}

/**
 * Something {@link flushNotifications} notifies: a store, a computed value or an effect.
 *
 * @internal
 */
export interface Notifiable {
    notifyListeners(errors: unknown[]): void;
    /**
     * Effects run before the listeners of stores and computed values, so that listeners see the state the effects
     * have settled.
     */
    readonly isEffect?: true;
    /**
     * Names it in error messages.
     */
    describe?(): string;
}

/**
 * Something that computed values and effects can be linked to.
 *
 * @internal
 */
export interface HasObservers {
    /**
     * Computed values and effects that depend on it and are linked to it. A change marks them stale and queues them.
     */
    readonly observers: Set<Observer>;
}

/**
 * A value that computed values and effects can depend on: a store or a computed value.
 *
 * @internal
 */
export interface ReactiveNode extends ReadableStore<unknown>, HasObservers {
    /**
     * Returns the current value without tracking the read. A store returns its state, which is a new object after
     * every change; a computed value keeps its previous value while it is equal. So a reference that differs from
     * the one read before means that the node has changed.
     */
    peek(): unknown;
    /**
     * Links `observer` to this node, so that changes of this node mark it stale and queue it.
     */
    addObserver(observer: Observer): void;
    /**
     * Unlinks `observer`.
     */
    removeObserver(observer: Observer): void;
}

/**
 * Something linked to the nodes it depends on: a computed value with listeners, or an effect.
 *
 * @internal
 */
export interface Observer extends Notifiable, HasObservers {
    /**
     * Marks it as possibly outdated: one of its dependencies has changed. Returns `false` if it was already marked.
     */
    markStale(): boolean;
}

/**
 * What was read from a node: its value at the time, and which of its keys (`null`: the whole value).
 *
 * @internal
 */
export type Read = {
    value: unknown;
    keys: Set<PropertyKey> | null;
    /**
     * The proxy recording the keys read from `proxied`.
     */
    proxy?: object;
    proxied?: object;
};

/**
 * The nodes read by a computation, an effect or a tracked function, with what was read from them.
 *
 * @internal
 */
export type Reads = Map<ReactiveNode, Read>;
