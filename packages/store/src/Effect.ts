import { batch, hasChanged, runWithReads, untracked } from './runtime';

import type { Observer, Reads } from './types';

/**
 * Undoes what an effect run did. Returned by the effect function.
 */
export type EffectCleanup = () => void;

/**
 * The run of an effect, passed to the effect function.
 */
export type EffectScope = {
    /**
     * Runs `fn` tracking its reads as dependencies of this run of the effect. Reads are only tracked while the
     * function runs synchronously: after an `await`, wrap the reads in `scope.run`.
     *
     * Once the effect has run again or has been disposed, the scope is outdated: `fn` still runs, but its reads are
     * not tracked (they would mix with the dependencies of the new run).
     */
    run<T>(fn: () => T): T;
    /**
     * Whether this is still the latest run of an effect that is not disposed.
     */
    readonly active: boolean;
};

/**
 * Runs `run` now and again whenever a store or computed value it read during its last run changes.
 *
 * - The dependencies are collected on every run, so conditional reads work. Reading non-reactive values (options,
 *   fields) is fine, but their changes do not re-run the effect.
 * - Re-runs happen in the notification queue: after the change (or after the outermost `batch`, or on
 *   `flushNotifications` after `deferNotifications`), once per change, and only if a dependency really changed
 *   (a computed value that kept its value does not re-run it). Effects run before the listeners of stores and
 *   computed values, so listeners see the state the effects have settled.
 * - `run` may change stores; the changes are notified after the run.
 * - `run` may return a cleanup function, called before the next run and when the effect is disposed (other
 *   return values, e.g. the promise of an async function, are ignored).
 * - Only synchronous reads are tracked. In an async function, reads after an `await` are not, unless they are
 *   wrapped in `scope.run(…)` (`scope` is the argument of `run`).
 *
 * @example
 * effect(async (scope) => {
 *     const id = selection.state.id;          // tracked
 *     const item = await load(id);
 *     scope.run(() => {
 *         render(item, settings.state.locale); // tracked too
 *     });
 * });
 *
 * @example
 * const dispose = effect(() => {
 *     element.hidden = !popup.state.open;
 * });
 * dispose(); // stops re-running
 *
 * @returns A function that stops the effect and runs the last cleanup.
 */
export function effect(run: (scope: EffectScope) => unknown): () => void {
    const instance = new Effect(run);
    batch(() => instance.run());
    return instance.dispose;
}

class Effect implements Observer {
    readonly isEffect = true;

    /**
     * Required by {@link Observer}. Nothing depends on an effect, so it stays empty.
     */
    readonly observers = new Set<Observer>();

    private dependencies: Reads = new Map();

    private stale = false;

    private disposed = false;

    private cleanup: EffectCleanup | undefined;

    /**
     * Grows on every run, so that the scope of an earlier run knows it is outdated.
     */
    private generation = 0;

    private readonly fn: (scope: EffectScope) => unknown;

    constructor(fn: (scope: EffectScope) => unknown) {
        this.fn = fn;
    }

    /**
     * For error messages.
     */
    describe(): string {
        return `effect ${this.fn.toString().slice(0, 200)}`;
    }

    markStale(): boolean {
        if (this.stale) {
            return false;
        }
        this.stale = true;
        return true;
    }

    notifyListeners(errors: unknown[]) {
        if (this.disposed || !this.stale) {
            return;
        }
        this.stale = false;
        if (!hasChanged(this.dependencies)) {
            return;
        }
        try {
            this.run();
        } catch (error) {
            errors.push(error);
        }
    }

    run() {
        this.runCleanup();
        this.generation += 1;
        const scope = this.createScope(this.generation);
        const previous = this.dependencies;
        const dependencies: Reads = new Map();
        // Current before the function runs, so that `scope.run` called synchronously records into it too.
        this.dependencies = dependencies;
        try {
            const result = runWithReads(dependencies, () => this.fn(scope));
            if (isCleanup(result)) {
                this.cleanup = result;
            }
        } finally {
            for (const dependency of dependencies.keys()) {
                if (!previous.has(dependency)) {
                    dependency.addObserver(this);
                }
            }
            for (const dependency of previous.keys()) {
                if (!dependencies.has(dependency)) {
                    dependency.removeObserver(this);
                }
            }
        }
    }

    private createScope(generation: number): EffectScope {
        const isActive = () => !this.disposed && this.generation === generation;
        return {
            get active() {
                return isActive();
            },
            run: <T>(fn: () => T): T => {
                if (!isActive()) {
                    return untracked(fn);
                }
                const dependencies = this.dependencies;
                const before = new Set(dependencies.keys());
                try {
                    // The reads go to the dependencies of this run; the ones of new sources link the effect to them.
                    return runWithReads(dependencies, fn);
                } finally {
                    for (const dependency of dependencies.keys()) {
                        if (!before.has(dependency)) {
                            dependency.addObserver(this);
                        }
                    }
                }
            }
        };
    }

    readonly dispose = () => {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        for (const dependency of this.dependencies.keys()) {
            dependency.removeObserver(this);
        }
        this.dependencies.clear();
        this.runCleanup();
    };

    private runCleanup() {
        const { cleanup } = this;
        this.cleanup = undefined;
        cleanup?.();
    }
}

/**
 * The function may return a cleanup; anything else (e.g. the promise of an async function) is ignored.
 */
function isCleanup(value: unknown): value is EffectCleanup {
    return typeof value === 'function';
}
