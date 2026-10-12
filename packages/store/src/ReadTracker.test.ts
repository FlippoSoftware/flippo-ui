import { describe, expect, it } from 'vitest';

import { computed, ReadTracker, Store } from './index';

describe('ReadTracker', () => {
    it('records the stores and computed values read, and only them', () => {
        const a = new Store({ value: 1 });
        const b = new Store({ value: 2 });
        const sum = computed(() => a.state.value + b.state.value);
        const unrelated = new Store({ value: 0 });
        const options = { factor: 3 };
        const reads = new ReadTracker();

        expect(reads.track(() => a.state.value * options.factor)).toBe(3);
        reads.track(() => sum.state);
        unrelated.state; // outside `track`

        expect(reads.sources).toEqual([a, sum]);

        reads.clear();
        expect(reads.sources).toEqual([]);
    });

    it('reports changes made after the read', () => {
        const store = new Store({ value: 1 });
        const double = computed(() => store.state.value * 2);
        const reads = new ReadTracker();
        reads.track(() => double.state);
        expect(reads.hasChanged()).toBe(false);

        store.set('value', 1);
        expect(reads.hasChanged()).toBe(false);

        store.set('value', 2);
        expect(reads.hasChanged()).toBe(true);
    });

    it('allows changing stores while tracking, unlike a computation', () => {
        const store = new Store({ value: 1 });
        const reads = new ReadTracker();
        reads.track(() => store.set('value', 2));
        expect(store.state.value).toBe(2);
    });

    it('does not leak reads into a computed value being computed', () => {
        const a = new Store({ value: 1 });
        const b = new Store({ value: 10 });
        const reads = new ReadTracker();
        const value = computed(() => a.state.value + reads.track(() => b.state.value));
        value.subscribe(() => {});

        expect(value.state).toBe(11);
        expect(reads.sources).toEqual([b]);
        expect(b.observers.size).toBe(0);
    });

    it('does not record the sources it ignores', () => {
        const options = new Store({ onChange: () => {} });
        const state = new Store({ open: false });
        const reads = new ReadTracker({ ignore: (source) => source === options });
        reads.track(() => [options.state.onChange, state.state.open]);

        expect(reads.sources).toEqual([state]);
        options.set('onChange', () => {});
        expect(reads.hasChanged()).toBe(false);
    });
});
