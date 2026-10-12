import { assertCanChange, registerChange, trackState } from './runtime';

import type { Listener, Notifiable, Observer, ReactiveNode, ReadableStore } from './types';

/**
 * A data store implementation that allows subscribing to state changes and updating the state.
 * It uses an observer pattern to notify subscribers when the state changes.
 */
export class Store<State> implements ReadableStore<State>, Notifiable, ReactiveNode {
    /**
     * @internal
     */
    public readonly observers: Set<Observer> = new Set();

    private currentState: State;

    private readonly listeners = new Set<Listener<State>>();

    constructor(state: State) {
        this.currentState = state;
    }

    /**
     * The current state of the store.
     * This property is updated immediately when the state changes as a result of calling {@link setState}, {@link update}, or {@link set}.
     * Reading it inside a computed value makes the computed value depend on this store.
     *
     * Do not modify properties in state directly. Instead, use the provided methods to ensure proper state management
     * and listener notification.
     */
    public get state(): State {
        return trackState(this, this.currentState);
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
     * Updates the entire store's state and notifies all registered listeners: right away, or after the
     * current {@link batch} or listener notification.
     *
     * Subclasses may override it to restrict what can be written (`ComponentStore` keeps controlled values).
     *
     * @param newState The new state to set for the store.
     */
    public setState(newState: State) {
        this.replaceState(newState);
    }

    /**
     * Writes `newState` as is, bypassing the restrictions of {@link setState} overrides, and notifies the listeners.
     * The other setters (`update`, `set`, `notifyAll`) use it after building the new state themselves.
     */
    protected replaceState(newState: State) {
        if (this.currentState === newState) {
            return;
        }
        assertCanChange();

        this.currentState = newState;
        registerChange(this);
    }

    /**
     * Returns the state without tracking the read.
     *
     * @internal
     */
    peek(): State {
        return this.currentState;
    }

    /**
     * @internal
     */
    addObserver(observer: Observer) {
        this.observers.add(observer);
    }

    /**
     * @internal
     */
    removeObserver(observer: Observer) {
        this.observers.delete(observer);
    }

    /**
     * Calls the listeners with the current state, collecting their errors.
     *
     * @internal Used by {@link flushNotifications}; use the state setters instead.
     */
    notifyListeners(errors: unknown[]) {
        const state = this.currentState;
        for (const listener of this.listeners) {
            if (this.currentState !== state) {
                // A listener changed the state again: the store is queued, and every listener will get the latest state.
                return;
            }
            try {
                listener(state);
            } catch (error) {
                errors.push(error);
            }
        }
    }

    /**
     * Merges the provided changes into the current state and notifies listeners if there are changes.
     *
     * @param changes An object containing the changes to apply to the current state.
     */
    public update(changes: Partial<State>) {
        for (const key in changes) {
            if (!Object.is(this.currentState[key], changes[key])) {
                this.replaceState({ ...this.currentState, ...changes });
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
        if (!Object.is(this.currentState[key], value)) {
            this.replaceState({ ...this.currentState, [key]: value });
        }
    }

    /**
     * Gives the state a new reference and notifies all `subscribe` listeners. Computed values, effects and tracked
     * reads only react to changes of the keys they read, so this does not re-run them: keep the values they depend
     * on in a store instead of poking it.
     */
    public notifyAll() {
        this.replaceState({ ...this.currentState });
    }
}
