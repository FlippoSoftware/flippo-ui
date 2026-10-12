/**
 * The shared runtime of stores, computed values and effects: the notification queue, batching and the tracking of
 * reads.
 */

import type { HasObservers, Notifiable, ReactiveNode, Read, Reads } from './types';

let batchDepth = 0;

let flushing = false;

let flushScheduled = false;

/**
 * Stores and computed values whose listeners have not been notified about their latest value yet, in the order
 * of their first unnotified change.
 */
const pendingNodes = new Set<Notifiable>();

/**
 * Effects to re-run, in the order of the first change of their dependencies. They run before `pendingNodes`.
 */
const pendingEffects = new Set<Notifiable>();

function queue(node: Notifiable) {
    (node.isEffect ? pendingEffects : pendingNodes).add(node);
}

/**
 * A new object after every change of any store, like a frame id: a computed value checked in the current epoch is
 * up to date. Computed values that are not linked to their dependencies (nobody tells them about changes) rely
 * on it.
 */
let epoch: object = {};

/**
 * @internal
 */
export function getEpoch(): object {
    return epoch;
}

/**
 * The reads of the computation (or the tracked function) that is running.
 */
let tracker: Reads | null = null;

let computingDepth = 0;

/**
 * Records that the whole `value` of `node` was read by the computation (or the tracked function) that is running,
 * if any.
 *
 * @internal
 */
export function track(node: ReactiveNode, value: unknown) {
    if (tracker === null) {
        return;
    }
    const read = tracker.get(node);
    if (read) {
        read.keys = null;
    } else {
        tracker.set(node, { value, keys: null });
    }
}

/**
 * Records a read of the state of `node`, and returns what to read it through: while something is tracked, a proxy
 * recording the keys read, so that changes of other keys are not changes for the reader. Reading all keys
 * (`Object.keys`, spreading, `in` loops) records the whole state.
 *
 * @internal
 */
export function trackState<State>(node: ReactiveNode, state: State): State {
    if (tracker === null) {
        return state;
    }
    if (!isObject(state)) {
        track(node, state);
        return state;
    }
    let read = tracker.get(node);
    if (!read) {
        read = { value: state, keys: new Set() };
        tracker.set(node, read);
    }
    if (read.keys === null) {
        return state;
    }
    if (read.proxied !== state) {
        read.proxied = state;
        read.proxy = recordKeys(state, read);
    }
    // The proxy of this very `state`.
    return read.proxy as State;
}

function isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null;
}

function recordKeys(target: object, read: Read): object {
    return new Proxy(target, {
        get(object, key) {
            read.keys?.add(key);
            return Reflect.get(object, key);
        },
        has(object, key) {
            read.keys?.add(key);
            return Reflect.has(object, key);
        },
        getOwnPropertyDescriptor(object, key) {
            read.keys?.add(key);
            return Reflect.getOwnPropertyDescriptor(object, key);
        },
        ownKeys(object) {
            read.keys = null;
            return Reflect.ownKeys(object);
        }
    });
}

/**
 * Whether one of the recorded nodes has changed in what was read from it: its whole value, or one of the keys read.
 *
 * @internal
 */
export function hasChanged(reads: Reads): boolean {
    for (const [node, read] of reads) {
        const current = node.peek();
        if (Object.is(current, read.value)) {
            continue;
        }
        const before = read.value;
        if (read.keys === null || !isObject(before) || !isObject(current)) {
            return true;
        }
        for (const key of read.keys) {
            if (!Object.is(Reflect.get(before, key), Reflect.get(current, key))) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Runs `compute` collecting the nodes it reads into `dependencies`.
 *
 * @internal
 */
export function runTracked<T>(dependencies: Reads, compute: () => T): T {
    const previous = tracker;
    tracker = dependencies;
    computingDepth += 1;
    try {
        return compute();
    } finally {
        tracker = previous;
        computingDepth -= 1;
    }
}

/**
 * Runs `read` collecting the nodes it reads into `reads`, without the restrictions of a computation (stores
 * may be changed).
 *
 * @internal
 */
export function runWithReads<T>(reads: Reads, read: () => T): T {
    const previous = tracker;
    tracker = reads;
    try {
        return read();
    } finally {
        tracker = previous;
    }
}

/**
 * Runs `fn` without recording the stores and computed values it reads (as dependencies of a computed value, an
 * effect or a tracked function).
 *
 * @example
 * const total = computed(() => cart.state.price * untracked(() => settings.state.rate));
 * // `total` is recomputed when `cart` changes, but not when only `settings` changes.
 */
export function untracked<T>(fn: () => T): T {
    const previous = tracker;
    tracker = null;
    try {
        return fn();
    } finally {
        tracker = previous;
    }
}

/**
 * Throws if a computed value is being computed: computations must not change stores.
 *
 * @internal
 */
export function assertCanChange() {
    if (computingDepth > 0) {
        throw new Error('Flippo store: stores cannot be changed while a computed value is computed.');
    }
}

/**
 * Registers a change of a store: starts a new epoch, queues the store and every linked computed value
 * that depends on it, and flushes unless a batch, a deferral or a flush is running.
 *
 * @internal
 */
export function registerChange(store: Notifiable & ReactiveNode) {
    epoch = {};
    queue(store);
    queueObservers(store);
    flushNotifications();
}

function queueObservers(node: HasObservers) {
    for (const observer of node.observers) {
        const wasPending = isPending(observer);
        queue(observer);
        // A value that was already stale has stale observers too; a pending one has pending observers. Go further
        // if either is not the case: e.g. it was read (and became fresh) since it was queued.
        if (observer.markStale() || !wasPending) {
            queueObservers(observer);
        }
    }
}

/**
 * Whether `node` waits for its listeners to be notified.
 *
 * @internal
 */
export function isPending(node: Notifiable) {
    return pendingNodes.has(node) || pendingEffects.has(node);
}

/**
 * Runs `fn` and notifies the listeners of the changed stores once it returns, after the outermost batch.
 * State changes apply immediately (`store.state` is up to date inside `fn`), each store notifies once with its
 * latest state, and stores notify in the order they first changed.
 *
 * If `fn` throws, the changes it made are still delivered, in a microtask, so that a listener error does not
 * hide the original one.
 */
export function batch<T>(fn: () => T): T {
    batchDepth += 1;
    let failed = true;
    try {
        const result = fn();
        failed = false;
        return result;
    } finally {
        batchDepth -= 1;
        if (failed) {
            scheduleFlush();
        } else {
            flushNotifications();
        }
    }
}

/**
 * Runs `fn` with listener notifications deferred: state changes apply immediately (`store.state` is up to date),
 * but listeners are only called by {@link flushNotifications}, or in a microtask at the latest, so that a missed
 * flush never loses notifications.
 *
 * Framework adapters use it to push options into machines while rendering, when notifying other components is
 * not allowed, and flush once the render is committed. Use {@link batch} elsewhere.
 */
export function deferNotifications<T>(fn: () => T): T {
    batchDepth += 1;
    try {
        return fn();
    } finally {
        batchDepth -= 1;
        scheduleFlush();
    }
}

/**
 * Notifies the listeners of every store and computed value with unnotified changes, once each with its latest
 * value, after re-running the effects whose dependencies changed. Changes made by listeners and effects are queued
 * and handled in the same flush; effects always go first. Does nothing inside {@link batch} or
 * {@link deferNotifications}, or during a flush.
 *
 * A throwing listener does not stop the flush: the error is rethrown once everything is notified (several errors
 * as an `AggregateError`).
 */
export function flushNotifications() {
    if (batchDepth > 0 || flushing) {
        return;
    }
    flushing = true;
    const errors: unknown[] = [];
    try {
        let node = nextPending();
        let count = 0;
        while (node !== undefined) {
            count += 1;
            if (count > MAX_NOTIFICATIONS_PER_FLUSH) {
                pendingNodes.clear();
                pendingEffects.clear();
                throw new Error(
                    `Flippo store: more than ${MAX_NOTIFICATIONS_PER_FLUSH} notifications in one flush. An effect or a listener probably keeps changing what it depends on (last: ${describe(node)}).`
                );
            }
            node.notifyListeners(errors);
            node = nextPending();
        }
    } finally {
        flushing = false;
    }
    if (errors.length === 1) {
        throw errors[0];
    }
    if (errors.length > 1) {
        throw new AggregateError(errors, 'Several store listeners threw');
    }
}

/**
 * Guards against effects and listeners that keep changing what they depend on: a flush never ends otherwise.
 */
const MAX_NOTIFICATIONS_PER_FLUSH = 100_000;

function describe(node: Notifiable): string {
    return node.describe?.() ?? node.constructor.name;
}

function nextPending(): Notifiable | undefined {
    const pending = pendingEffects.size > 0 ? pendingEffects : pendingNodes;
    const node = pending.values().next().value;
    if (node !== undefined) {
        pending.delete(node);
    }
    return node;
}

function scheduleFlush() {
    if (flushScheduled || batchDepth > 0 || (pendingNodes.size === 0 && pendingEffects.size === 0)) {
        return;
    }
    flushScheduled = true;
    queueMicrotask(() => {
        flushScheduled = false;
        flushNotifications();
    });
}
