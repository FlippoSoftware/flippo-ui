import type { AnySelector, CreateSelectorFunction } from './createSelector.types';

/**
 * Creates a selector function that can be used to derive values from the store's state.
 * The selector can take up to three additional arguments that can be used in the selector logic.
 * This function accepts up to six functions and combines them into a single selector function.
 * The last parameter is the combiner function that combines the results of the previous selectors.
 *
 * @example
 * ```ts
 * const selector = createSelector(
 *  (state) => state.disabled
 * );
 * ```
 *
 * @example
 * ```ts
 * const selector = createSelector(
 *   (state) => state.disabled,
 *   (state) => state.open,
 *   (disabled, open) => ({ disabled, open })
 * );
 * ```
 */
export const createSelector = ((...selectors: AnySelector[]) => {
    const [a, b, c, d, e, f, ...other] = selectors;

    if (other.length > 0) {
        throw new Error('Flippo store: `createSelector` takes up to five selectors and a combiner.');
    }

    if (a && b && c && d && e && f) {
        return (state: unknown, a1: unknown, a2: unknown, a3: unknown) =>
            f(a(state, a1, a2, a3), b(state, a1, a2, a3), c(state, a1, a2, a3), d(state, a1, a2, a3), e(state, a1, a2, a3), a1, a2, a3);
    }

    if (a && b && c && d && e) {
        return (state: unknown, a1: unknown, a2: unknown, a3: unknown) =>
            e(a(state, a1, a2, a3), b(state, a1, a2, a3), c(state, a1, a2, a3), d(state, a1, a2, a3), a1, a2, a3);
    }

    if (a && b && c && d) {
        return (state: unknown, a1: unknown, a2: unknown, a3: unknown) =>
            d(a(state, a1, a2, a3), b(state, a1, a2, a3), c(state, a1, a2, a3), a1, a2, a3);
    }

    if (a && b && c) {
        return (state: unknown, a1: unknown, a2: unknown, a3: unknown) => c(a(state, a1, a2, a3), b(state, a1, a2, a3), a1, a2, a3);
    }

    if (a && b) {
        return (state: unknown, a1: unknown, a2: unknown, a3: unknown) => b(a(state, a1, a2, a3), a1, a2, a3);
    }

    if (a) {
        return a;
    }

    throw new Error('Flippo store: `createSelector` needs a selector.');
    // The implementation is untyped: `CreateSelectorFunction` declares the inferred signature.
}) as unknown as CreateSelectorFunction;

type CacheKey = { id: number };

const CACHE_KEY = '__cacheKey__';

/**
 * A state object, which a memoized selector marks with the key of its cache.
 */
type CachedState = Record<PropertyKey, unknown> & { [CACHE_KEY]?: CacheKey };

type MemoizedCombiner = {
    hasResult: boolean;
    inputs: unknown[];
    result: unknown;
};

/**
 * Like {@link createSelector}, but memoizes the combiner result: it is recomputed only when one of the
 * input selector results or extra arguments changes (compared with `Object.is`).
 *
 * The cache is kept per store: the state object carries a `__cacheKey__` that survives state updates
 * (they copy the state with a spread), so selectors shared between several stores don't evict each other.
 */
export const createSelectorMemoized: CreateSelectorFunction = ((...selectors: AnySelector[]) => {
    const combiner = selectors[selectors.length - 1];
    if (!combiner) {
        throw new Error('Flippo store: `createSelectorMemoized` needs a combiner.');
    }
    const inputSelectors = selectors.slice(0, -1);
    const nSelectors = inputSelectors.length || 1;
    // (s1, s2, ..., sN, a1, a2, a3) => { ... }
    const argsLength = combiner.length - nSelectors;

    if (argsLength > 3) {
        throw new Error('Flippo store: a memoized combiner takes up to three extra arguments.');
    }

    const cache = new WeakMap<CacheKey, MemoizedCombiner>();
    let nextCacheId = 1;

    return (state: CachedState, a1: unknown, a2: unknown, a3: unknown) => {
        let cacheKey = state[CACHE_KEY];
        if (!cacheKey) {
            cacheKey = { id: nextCacheId };
            state[CACHE_KEY] = cacheKey;
            nextCacheId += 1;
        }

        let memo = cache.get(cacheKey);
        if (!memo) {
            memo = { hasResult: false, inputs: [], result: undefined };
            cache.set(cacheKey, memo);
        }

        const extraArgs = [a1, a2, a3].slice(0, Math.max(argsLength, 0));
        const inputs =
            inputSelectors.length === 0
                ? [state, ...extraArgs]
                : [...inputSelectors.map((selector) => selector(state, a1, a2, a3)), ...extraArgs];

        if (
            memo.hasResult &&
            inputs.length === memo.inputs.length &&
            inputs.every((input, index) => Object.is(input, memo.inputs[index]))
        ) {
            return memo.result;
        }

        memo.result = combiner(...inputs);
        memo.inputs = inputs;
        memo.hasResult = true;
        return memo.result;
    };
    // The implementation is untyped: `CreateSelectorFunction` declares the inferred signature.
}) as unknown as CreateSelectorFunction;
