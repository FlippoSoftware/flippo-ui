import { describe, expect, it, vi } from 'vitest';

import { ComponentStore, computed, createSelector, createSelectorMemoized, effect, ReadTracker, Store } from './index';

describe('key tracking', () => {
    it('recomputes a computed value only when a key it read changes', () => {
        const store = new Store({ a: 1, b: 1 });
        const compute = vi.fn(() => store.state.a * 2);
        const double = computed(compute);
        double.subscribe(() => {});
        expect(compute).toHaveBeenCalledTimes(1);

        store.set('b', 2);
        expect(double.state).toBe(2);
        expect(compute).toHaveBeenCalledTimes(1);

        store.set('a', 2);
        expect(double.state).toBe(4);
        expect(compute).toHaveBeenCalledTimes(2);
    });

    it('re-runs an effect only when a key it read changes', () => {
        const store = new Store({ open: false, position: 0 });
        const run = vi.fn(() => store.state.open);
        effect(run);

        store.set('position', 10);
        expect(run).toHaveBeenCalledTimes(1);
        store.set('open', true);
        expect(run).toHaveBeenCalledTimes(2);
    });

    it('depends on the whole state when all keys are read', () => {
        const store = new Store({ a: 1, b: 1 });
        const keys = vi.fn(() => Object.keys(store.state).length);
        const spread = vi.fn(() => ({ ...store.state }));
        effect(keys);
        effect(spread);

        store.set('b', 2);
        expect(keys).toHaveBeenCalledTimes(2);
        expect(spread).toHaveBeenCalledTimes(2);
    });

    it('tracks the keys read through selectors', () => {
        type State = { activeIndex: number | null; items: string[]; open: boolean };
        const selectors = {
            isActive: createSelector((state: State, index: number) => state.activeIndex === index),
            visibleItems: createSelectorMemoized(
                (state: State) => state.items,
                (state: State) => state.open,
                (items, open) => (open ? items : [])
            )
        };
        const store = new ComponentStore<State, Record<string, never>, typeof selectors>(
            { activeIndex: null, items: ['a'], open: true },
            {},
            selectors
        );
        const reads = new ReadTracker();
        const visible = reads.track(() => store.select('visibleItems'));
        reads.track(() => store.select('isActive', 0));
        expect(visible).toEqual(['a']);

        store.set('activeIndex', null);
        expect(reads.hasChanged()).toBe(false);
        // The memoized selector keeps its cache across states (it writes its cache key through the proxy).
        expect(store.select('visibleItems')).toBe(visible);

        store.set('activeIndex', 0);
        expect(reads.hasChanged()).toBe(true);
    });

    it('reports a change of a key read by a tracked function', () => {
        const store = new Store({ a: 1, b: 1 });
        const reads = new ReadTracker();
        reads.track(() => store.state.a);

        store.set('b', 2);
        expect(reads.hasChanged()).toBe(false);
        store.set('a', 2);
        expect(reads.hasChanged()).toBe(true);
    });

    it('does not depend on the state an effect writes', () => {
        const source = new Store({ value: 1 });
        const target = new Store({ value: 0, other: 0 });
        const run = vi.fn(() => {
            target.update({ value: source.state.value });
        });
        effect(run);

        target.set('other', 1);
        expect(run).toHaveBeenCalledTimes(1);
        source.set('value', 2);
        expect(target.state.value).toBe(2);
        expect(run).toHaveBeenCalledTimes(2);
    });

    it('returns the state itself outside tracking, and stable values inside', () => {
        const store = new Store({ list: [1, 2] });
        expect(store.state).toBe(store.peek());

        const reads = new ReadTracker();
        reads.track(() => {
            expect(store.state).toBe(store.state);
            expect(store.state.list).toBe(store.peek().list);
            expect(store.state).toEqual({ list: [1, 2] });
        });
    });
});
