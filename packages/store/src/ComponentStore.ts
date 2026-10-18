import { Store } from './Store';

import type { KeysAllowingUndefined, ObserveSelector, SelectMethod, SelectorFunction } from './ComponentStore.types';

/**
 * A framework-agnostic store for component state machines.
 *
 * On top of {@link Store} it provides:
 * - a non-reactive `context` (callbacks, element refs, timers, registries),
 * - named selectors (`select`, `getSelector`) that adapters subscribe to,
 * - synchronisation of controlled values coming from the outside (`syncControlledValue`),
 * - `observe`, to react to changes of a derived value.
 *
 * Framework adapters extend it with their own subscription primitives
 * (e.g. the React `ReactStore` adds `useState`, `useControlledProp`, `useContextCallback`).
 */
export class ComponentStore<
    State extends object,
    Context = Record<string, never>,
    Selectors extends Record<string, SelectorFunction<State>> = Record<string, never>
> extends Store<State> {
    /**
     * Non-reactive values such as element refs, callbacks, timers, etc.
     */
    public readonly context: Context;

    /**
     * Keeps track of which keys received a controlled value: local writes to them are ignored,
     * and switching between controlled and uncontrolled modes is reported.
     */
    private readonly controlledValues = new Map<keyof State, boolean>();

    private readonly selectors: Selectors | undefined;

    /**
     * @param state - Initial state of the store.
     * @param context - Non-reactive context values.
     * @param selectors - Optional named selectors.
     */
    constructor(
        state: State,
        // Without a context, `Context` is `Record<string, never>`: an empty object is one.
        context: Context = {} as Context,
        selectors?: Selectors
    ) {
        super(state);
        this.context = context;
        this.selectors = selectors;
    }

    /**
     * Returns the selector registered under `key`.
     * Adapters use it to subscribe to the derived value.
     */
    public getSelector<Key extends keyof Selectors>(key: Key): Selectors[Key] {
        const selector = this.selectors?.[key];
        if (!selector) {
            throw new Error(`Flippo store: selector "${String(key)}" is not registered in the store.`);
        }
        return selector;
    }

    /**
     * Gets the current value from the store using a selector with the provided key.
     *
     * @param key - Key of the selector to use.
     */
    public select = ((key: keyof Selectors, ...args: unknown[]) => {
        return this.getSelector(key)(this.state, ...args);
        // The implementation cannot express the per-key signature: the type is declared by `SelectMethod`.
    }) as SelectMethod<Selectors>;

    /**
     * Synchronizes a single external value into the store.
     */
    public syncValue<Key extends keyof State>(key: Key, value: State[Key]) {
        if (this.peek()[key] !== value) {
            this.set(key, value);
        }
    }

    /**
     * Synchronizes a single external value into the store and returns a cleanup that
     * resets it to `undefined` (e.g. when the part that owns the value unmounts).
     */
    public syncValueWithCleanup<Key extends KeysAllowingUndefined<State>>(key: Key, value: State[Key]) {
        this.syncValue(key, value);
        return () => {
            // `KeysAllowingUndefined` guarantees that `undefined` is a valid value, which TypeScript cannot infer.
            this.set(key, undefined as State[Key]);
        };
    }

    /**
     * Synchronizes multiple external values into the store.
     */
    public syncValues(values: Partial<State>) {
        this.update(values);
    }

    /**
     * Synchronizes a controllable value (e.g. the `open` prop) into the store.
     * - If `controlled` is not `undefined`, the key is controlled: the store's state at `key` is updated to
     *   match it and local writes to `key` (`set`, `update`, `setState`) are ignored.
     * - If `controlled` is `undefined`, the key is uncontrolled and the store keeps its own value.
     */
    public syncControlledValue<Key extends keyof State>(key: Key, controlled: State[Key] | undefined) {
        const isControlled = controlled !== undefined;

        if (process.env.NODE_ENV !== 'production') {
            const previouslyControlled = this.controlledValues.get(key);
            if (previouslyControlled !== undefined && previouslyControlled !== isControlled) {
                // biome-ignore lint/suspicious/noConsole: development-only warning.
                console.error(
                    `A component is changing the ${isControlled ? '' : 'un'}controlled state of ${String(key)} to be ${
                        isControlled ? 'un' : ''
                    }controlled. Elements should not switch from uncontrolled to controlled (or vice versa).`
                );
            }
        }
        this.controlledValues.set(key, isControlled);

        const state = this.peek();
        if (isControlled && !Object.is(state[key], controlled)) {
            // Bypasses `setState`, which keeps controlled keys: this is the one way to change them.
            this.replaceState({ ...state, [key]: controlled });
        }
    }

    public override setState(newState: State) {
        super.setState(this.withoutControlledChanges(newState));
    }

    public override update(changes: Partial<State>) {
        super.update(this.withoutControlledChanges(changes));
    }

    public override set<Key extends keyof State>(key: Key, value: State[Key]) {
        if (this.controlledValues.get(key) !== true) {
            super.set(key, value);
        }
    }

    /**
     * Whether a controlled value was last synchronized for `key`.
     */
    public isControlled(key: keyof State): boolean {
        return this.controlledValues.get(key) === true;
    }

    /**
     * Restores the controlled keys of `changes` to their current values.
     */
    private withoutControlledChanges<Changes extends Partial<State>>(changes: Changes): Changes {
        const state = this.peek();
        let result: Partial<State> = changes;
        for (const [key, controlled] of this.controlledValues) {
            if (controlled && Object.hasOwn(changes, key) && !Object.is(changes[key], state[key])) {
                if (result === changes) {
                    result = { ...changes };
                }
                result[key] = state[key];
            }
        }
        // The keys of `changes`, with the controlled ones restored: still a `Changes`.
        return result as Changes;
    }

    /**
     * Assigns a value (usually a callback) to the non-reactive context.
     */
    public setContextValue<Key extends keyof Context>(key: Key, value: Context[Key]) {
        this.context[key] = value;
    }

    /**
     * Returns a setter for a specific key of the state.
     * Handy for passing element setters to adapters (e.g. as ref callbacks).
     */
    public createSetter<Key extends keyof State>(key: Key): (value: State[Key]) => void {
        return (value) => {
            this.set(key, value);
        };
    }

    /**
     * Observes changes of a value derived from the store and calls the listener when it changes.
     * The listener is called immediately with the current value.
     *
     * @param selector - Key of a registered selector or a selector function.
     * @param listener - Listener called with the new and the previous value.
     * @returns A function to stop observing.
     */
    public observe<Key extends keyof Selectors>(
        selector: Key,
        listener: (newValue: ReturnType<Selectors[Key]>, oldValue: ReturnType<Selectors[Key]>, store: this) => void
    ): () => void;

    public observe<S extends ObserveSelector<State>>(
        selector: S,
        listener: (newValue: ReturnType<S>, oldValue: ReturnType<S>, store: this) => void
    ): () => void;

    // biome-ignore lint/suspicious/noExplicitAny: the implementation of the overloads accepts the listeners of both.
    public observe(selector: keyof Selectors | ObserveSelector<State>, listener: (newValue: any, oldValue: any, store: this) => void) {
        const selectFn: ObserveSelector<State> = typeof selector === 'function' ? selector : this.getSelector(selector);

        let prevValue = selectFn(this.peek());

        listener(prevValue, prevValue, this);

        return this.subscribe((nextState) => {
            const nextValue = selectFn(nextState);
            if (!Object.is(prevValue, nextValue)) {
                const oldValue = prevValue;
                prevValue = nextValue;
                listener(nextValue, oldValue, this);
            }
        });
    }
}
