import { getEpoch, hasChanged, isPending, runTracked, track } from './runtime';

import type { Listener, Observer, ReactiveNode, ReadableStore, Reads } from './types';

export type ComputedOptions<Value> = {
    /**
     * Decides whether a recomputed value equals the previous one. When it does, the previous value is kept and
     * nothing is notified. Defaults to `Object.is`.
     */
    equals?: ((a: Value, b: Value) => boolean) | undefined;
};

/**
 * A value derived from stores and other computed values. Create it with {@link computed}.
 *
 * - It is lazy: `compute` runs when the value is read and one of the values it read last time has changed.
 *   Reads are always up to date, even inside a `batch` or a deferral.
 * - Its listeners are notified in the same queue as the stores, after the change, once, and only when the
 *   value changes.
 */
export class Computed<Value> implements ReadableStore<Value>, ReactiveNode, Observer {
    /**
     * @internal
     */
    public readonly observers: Set<Observer> = new Set();

    private readonly listeners = new Set<Listener<Value>>();

    /**
     * Set by the first computation (`hasValue`).
     */
    private value!: Value;

    private hasValue = false;

    /**
     * The stores and computed values read by the last computation, with the values read.
     */
    private dependencies: Reads = new Map();

    /**
     * The epoch in which the value was last checked: no store has changed since then if it is the current one.
     * Used while the value is not linked.
     */
    private checkedIn: object | null = null;

    /**
     * Whether a dependency may have changed since the last check. Set by the dependencies while the value is
     * linked to them, so a linked value that is not stale is up to date, whatever happens to other stores.
     */
    private stale = true;

    private computing = false;

    /**
     * Whether this value is registered as an observer of its dependencies.
     */
    private linked = false;

    /**
     * The value last delivered to the listeners.
     */
    private notifiedValue: Value | undefined;

    private readonly compute: () => Value;

    private readonly equals: (a: Value, b: Value) => boolean;

    constructor(compute: () => Value, options: ComputedOptions<Value> = {}) {
        this.compute = compute;
        this.equals = options.equals ?? Object.is;
    }

    /**
     * The current value, recomputed first if one of its dependencies changed. Reading it inside another computed
     * value makes that value depend on this one.
     */
    public get state(): Value {
        this.refresh();
        track(this, this.value);
        return this.value;
    }

    /**
     * Returns the current value.
     */
    public getSnapshot = (): Value => {
        return this.state;
    };

    /**
     * Registers a listener called after the value changes. Returns a function to unsubscribe it.
     */
    public subscribe = (listener: Listener<Value>) => {
        this.listeners.add(listener);
        if (this.listeners.size === 1) {
            this.notifiedValue = this.peek();
        }
        this.link();
        return () => {
            if (this.listeners.delete(listener)) {
                this.unlinkIfUnused();
            }
        };
    };

    /**
     * Returns the up-to-date value without tracking the read.
     *
     * @internal
     */
    peek(): Value {
        this.refresh();
        return this.value;
    }

    /**
     * Brings the value up to date: recomputes it if a dependency now has a value other than the one read by the
     * last computation.
     */
    private refresh() {
        if (this.computing) {
            throw new Error('Flippo store: a computed value depends on itself.');
        }
        if (this.hasValue && (this.linked ? !this.stale : this.checkedIn === getEpoch())) {
            return;
        }
        if (!this.hasValue || hasChanged(this.dependencies)) {
            this.recompute();
        }
        this.checkedIn = getEpoch();
        this.stale = false;
    }

    /**
     * @internal Called by the dependencies when one of them changes.
     */
    markStale(): boolean {
        if (this.stale) {
            return false;
        }
        this.stale = true;
        return true;
    }

    /**
     * Notifies the listeners if the value changed since they were last notified.
     *
     * @internal Used by `flushNotifications`.
     */
    notifyListeners(errors: unknown[]) {
        if (this.listeners.size === 0) {
            return;
        }
        let value: Value;
        try {
            value = this.peek();
        } catch (error) {
            errors.push(error);
            return;
        }
        if (Object.is(value, this.notifiedValue)) {
            return;
        }
        this.notifiedValue = value;
        for (const listener of this.listeners) {
            if (isPending(this)) {
                // A listener changed a dependency: this value is queued again, and every listener will get the latest value.
                return;
            }
            try {
                listener(value);
            } catch (error) {
                errors.push(error);
            }
        }
    }

    private recompute() {
        const previousDependencies = this.dependencies;
        const dependencies: Reads = new Map();

        this.computing = true;
        let value: Value;
        try {
            value = runTracked(dependencies, this.compute);
        } finally {
            this.computing = false;
        }

        this.dependencies = dependencies;
        // An equal value keeps the previous reference, so the dependents see no change.
        if (!this.hasValue || !this.equals(this.value, value)) {
            this.value = value;
            this.hasValue = true;
        }

        if (this.linked) {
            for (const dependency of dependencies.keys()) {
                if (!previousDependencies.has(dependency)) {
                    dependency.addObserver(this);
                }
            }
            for (const dependency of previousDependencies.keys()) {
                if (!dependencies.has(dependency)) {
                    dependency.removeObserver(this);
                }
            }
        }
    }

    /**
     * Registers this value as an observer of its dependencies, so that their changes queue it.
     */
    private link() {
        if (this.linked) {
            return;
        }
        this.refresh();
        this.linked = true;
        for (const dependency of this.dependencies.keys()) {
            dependency.addObserver(this);
        }
    }

    private unlinkIfUnused() {
        if (!this.linked || this.listeners.size > 0 || this.observers.size > 0) {
            return;
        }
        this.linked = false;
        for (const dependency of this.dependencies.keys()) {
            dependency.removeObserver(this);
        }
    }

    /**
     * @internal Links an observer; a computed value with observers keeps itself linked to its own dependencies.
     */
    addObserver(observer: Observer) {
        this.observers.add(observer);
        this.link();
    }

    /**
     * @internal
     */
    removeObserver(observer: Observer) {
        this.observers.delete(observer);
        this.unlinkIfUnused();
    }
}

/**
 * Creates a value derived from stores and other computed values. The stores and computed values read by
 * `compute` become its dependencies, collected again on every computation (so conditional reads work).
 *
 * `compute` must not change stores, and should not have side effects: it runs lazily, when the value is read.
 *
 * @example
 * const cart = new Store({ items: [] as Item[] });
 * const settings = new Store({ currency: 'EUR' });
 *
 * const total = computed(() => {
 *     const sum = cart.state.items.reduce((acc, item) => acc + item.price, 0);
 *     return `${sum} ${settings.state.currency}`;
 * });
 *
 * total.state; // computed on first read
 * total.subscribe((value) => render(value)); // notified once per change, after the stores
 */
export function computed<Value>(compute: () => Value, options?: ComputedOptions<Value>): Computed<Value> {
    return new Computed(compute, options);
}
