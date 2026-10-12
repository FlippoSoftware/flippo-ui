import { describe, expect, it, vi } from 'vitest';

import { batch, ComponentStore, computed, createSelector, deferNotifications, flushNotifications, Store, untracked } from './index';

describe('computed', () => {
    it('computes lazily and recomputes only when a dependency changes', () => {
        const a = new Store({ value: 1 });
        const b = new Store({ value: 10 });
        const compute = vi.fn(() => a.state.value * 2);
        const double = computed(compute);

        expect(compute).not.toHaveBeenCalled();
        expect(double.state).toBe(2);
        expect(double.getSnapshot()).toBe(2);
        expect(compute).toHaveBeenCalledTimes(1);

        b.set('value', 20); // not a dependency
        expect(double.state).toBe(2);
        expect(compute).toHaveBeenCalledTimes(1);

        a.set('value', 2);
        a.set('value', 3);
        expect(compute).toHaveBeenCalledTimes(1); // nothing reads it yet
        expect(double.state).toBe(6);
        expect(compute).toHaveBeenCalledTimes(2);
    });

    it('is up to date inside a batch and a deferral', () => {
        const a = new Store({ value: 1 });
        const double = computed(() => a.state.value * 2);
        double.subscribe(() => {});

        batch(() => {
            a.set('value', 5);
            expect(double.state).toBe(10);
        });
        deferNotifications(() => {
            a.set('value', 6);
            expect(double.state).toBe(12);
        });
        flushNotifications();
    });

    it('tracks the dependencies of the last computation', () => {
        const flag = new Store({ on: true });
        const a = new Store({ value: 'a' });
        const b = new Store({ value: 'b' });
        const compute = vi.fn(() => (flag.state.on ? a.state.value : b.state.value));
        const picked = computed(compute);
        const listener = vi.fn();
        picked.subscribe(listener);

        b.set('value', 'b2'); // not read while `on`
        expect(listener).not.toHaveBeenCalled();
        expect(b.observers.size).toBe(0);

        flag.set('on', false);
        expect(listener).toHaveBeenLastCalledWith('b2');
        expect(a.observers.size).toBe(0);
        expect(b.observers.size).toBe(1);

        a.set('value', 'a2'); // no longer read
        expect(listener).toHaveBeenCalledTimes(1);
        expect(compute).toHaveBeenCalledTimes(2);
    });

    it('computes a diamond once per change, with consistent inputs', () => {
        const source = new Store({ value: 1 });
        const left = computed(() => source.state.value + 1);
        const right = computed(() => source.state.value * 10);
        const bottomCompute = vi.fn(() => `${left.state}/${right.state}`);
        const bottom = computed(bottomCompute);
        const listener = vi.fn();
        bottom.subscribe(listener);
        expect(bottomCompute).toHaveBeenCalledTimes(1);

        source.set('value', 2);
        expect(bottomCompute).toHaveBeenCalledTimes(2);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith('3/20');
    });

    it('notifies only when the value changes, after the stores it depends on', () => {
        const store = new Store({ count: 1, label: 'x' });
        const isEven = computed(() => store.state.count % 2 === 0);
        const order: string[] = [];
        isEven.subscribe((even) => order.push(`computed ${even}`));
        store.subscribe((state) => order.push(`store ${state.count}`));

        store.set('label', 'y');
        store.set('count', 3);
        expect(order).toEqual(['store 1', 'store 3']);

        store.set('count', 4);
        expect(order).toEqual(['store 1', 'store 3', 'store 4', 'computed true']);
    });

    it('keeps the previous value when `equals` says it is the same', () => {
        const store = new Store({ items: [1, 2, 3], other: 0 });
        const evens = computed(() => store.state.items.filter((item) => item % 2 === 0), {
            equals: (a, b) => a.length === b.length && a.every((item, index) => item === b[index])
        });
        const listener = vi.fn();
        evens.subscribe(listener);
        const first = evens.state;

        store.set('items', [2, 3]);
        expect(evens.state).toBe(first);
        expect(listener).not.toHaveBeenCalled();

        store.set('items', [2, 4]);
        expect(listener).toHaveBeenCalledWith([2, 4]);
    });

    it('notifies deferred changes on flush', () => {
        const store = new Store({ value: 1 });
        const double = computed(() => store.state.value * 2);
        const listener = vi.fn();
        double.subscribe(listener);

        deferNotifications(() => store.set('value', 2));
        expect(listener).not.toHaveBeenCalled();
        flushNotifications();
        expect(listener).toHaveBeenCalledWith(4);
    });

    it('links its dependencies while it has listeners', () => {
        const store = new Store({ value: 1 });
        const double = computed(() => store.state.value * 2);
        const quadruple = computed(() => double.state * 2);

        const unsubscribe = quadruple.subscribe(() => {});
        expect(store.observers.has(double)).toBe(true);
        expect(double.observers.has(quadruple)).toBe(true);

        unsubscribe();
        expect(store.observers.size).toBe(0);
        expect(double.observers.size).toBe(0);
        // Still correct when read without listeners.
        store.set('value', 3);
        expect(quadruple.state).toBe(12);
    });

    it('delivers the latest value when a listener changes a dependency', () => {
        const store = new Store({ value: 1 });
        const double = computed(() => store.state.value * 2);
        const seen: number[] = [];
        double.subscribe((value) => {
            if (value < 10) {
                store.set('value', 5);
            }
        });
        double.subscribe((value) => seen.push(value));

        store.set('value', 2);
        expect(seen).toEqual([10]);
    });

    it('does not track reads inside `untracked`', () => {
        const price = new Store({ value: 10 });
        const rate = new Store({ value: 2 });
        const total = computed(() => price.state.value * untracked(() => rate.state.value));
        expect(total.state).toBe(20);

        rate.set('value', 3);
        expect(total.state).toBe(20);
        price.set('value', 11);
        expect(total.state).toBe(33);
    });

    it('tracks ComponentStore selectors', () => {
        type State = { open: boolean; disabled: boolean };
        const selectors = { interactive: createSelector((state: State) => state.open && !state.disabled) };
        const store = new ComponentStore<State, Record<string, never>, typeof selectors>({ open: false, disabled: false }, {}, selectors);
        const interactive = computed(() => store.select('interactive'));
        const listener = vi.fn();
        interactive.subscribe(listener);

        store.set('open', true);
        expect(listener).toHaveBeenCalledWith(true);
    });

    it('rejects cycles and changes of stores while computing', () => {
        const store = new Store({ value: 1 });
        const self: { current: ReturnType<typeof computed<number>> | null } = { current: null };
        const cyclic = computed((): number => (self.current?.state ?? 0) + 1);
        self.current = cyclic;
        expect(() => cyclic.state).toThrow('depends on itself');

        const writing = computed(() => {
            store.set('value', 2);
            return 1;
        });
        expect(() => writing.state).toThrow('cannot be changed');
        expect(store.state.value).toBe(1);
    });

    it('rethrows errors of the computation and recovers once the dependency is fixed', () => {
        const store = new Store({ value: 1 });
        const checked = computed(() => {
            if (store.state.value < 0) {
                throw new Error('negative');
            }
            return store.state.value;
        });
        const listener = vi.fn();
        checked.subscribe(listener);

        expect(() => store.set('value', -1)).toThrow('negative');
        expect(() => checked.state).toThrow('negative');

        store.set('value', 2);
        expect(checked.state).toBe(2);
        expect(listener).toHaveBeenLastCalledWith(2);
    });

    describe('change detection', () => {
        it('does not check the dependencies of a linked value when other stores change', () => {
            const store = new Store({ value: 1 });
            const other = new Store({ value: 0 });
            const double = computed(() => store.state.value * 2);
            double.subscribe(() => {});
            const peek = vi.spyOn(store, 'peek');

            other.set('value', 1);
            expect(double.state).toBe(2);
            expect(peek).not.toHaveBeenCalled();

            store.set('value', 2);
            expect(double.state).toBe(4);
        });

        it('checks the dependencies of a value without listeners only after a change of some store', () => {
            const store = new Store({ value: 1 });
            const other = new Store({ value: 0 });
            const double = computed(() => store.state.value * 2);
            expect(double.state).toBe(2);
            const peek = vi.spyOn(store, 'peek');

            expect(double.state).toBe(2);
            expect(peek).not.toHaveBeenCalled(); // nothing changed since the last check

            other.set('value', 1);
            expect(double.state).toBe(2);
            expect(peek).toHaveBeenCalledTimes(1); // some store changed: compare the dependency
        });

        it('becomes stale again after being read inside a batch', () => {
            const store = new Store({ value: 1 });
            const middle = computed(() => store.state.value + 1);
            const end = computed(() => middle.state * 10);
            const listener = vi.fn();
            end.subscribe(listener);

            batch(() => {
                store.set('value', 2);
                expect(end.state).toBe(30); // the chain is fresh again, still queued
                store.set('value', 3);
                expect(end.state).toBe(40);
            });
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(40);
        });

        it('switches between the stale flag and the epoch when linked and unlinked', () => {
            const store = new Store({ value: 1 });
            const double = computed(() => store.state.value * 2);

            const unsubscribe = double.subscribe(() => {});
            store.set('value', 2);
            unsubscribe();
            store.set('value', 3);
            expect(double.state).toBe(6);

            double.subscribe(() => {});
            store.set('value', 4);
            expect(double.state).toBe(8);
        });
    });
});
