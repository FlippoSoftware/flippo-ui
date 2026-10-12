import { describe, expect, it, vi } from 'vitest';

import { batch, computed, deferNotifications, effect, flushNotifications, Store } from './index';

describe('effect', () => {
    it('runs now and again when a store it read changes', () => {
        const store = new Store({ value: 1 });
        const other = new Store({ value: 0 });
        const seen: number[] = [];
        const dispose = effect(() => {
            seen.push(store.state.value);
        });
        expect(seen).toEqual([1]);

        other.set('value', 1);
        store.set('value', 2);
        expect(seen).toEqual([1, 2]);

        dispose();
        store.set('value', 3);
        expect(seen).toEqual([1, 2]);
        expect(store.observers.size).toBe(0);
    });

    it('follows conditional reads', () => {
        const flag = new Store({ on: true });
        const a = new Store({ value: 'a' });
        const b = new Store({ value: 'b' });
        const run = vi.fn(() => (flag.state.on ? a.state.value : b.state.value));
        effect(run);

        b.set('value', 'b1');
        expect(run).toHaveBeenCalledTimes(1);
        flag.set('on', false);
        expect(run).toHaveBeenCalledTimes(2);
        a.set('value', 'a1');
        expect(run).toHaveBeenCalledTimes(2);
        b.set('value', 'b2');
        expect(run).toHaveBeenCalledTimes(3);
    });

    it('runs once per batch, and on flush after a deferral', () => {
        const a = new Store({ value: 0 });
        const b = new Store({ value: 0 });
        const run = vi.fn(() => a.state.value + b.state.value);
        effect(run);

        batch(() => {
            a.set('value', 1);
            b.set('value', 1);
        });
        expect(run).toHaveBeenCalledTimes(2);

        deferNotifications(() => a.set('value', 2));
        expect(run).toHaveBeenCalledTimes(2);
        flushNotifications();
        expect(run).toHaveBeenCalledTimes(3);
    });

    it('does not re-run when a computed dependency keeps its value', () => {
        const store = new Store({ count: 1 });
        const isOdd = computed(() => store.state.count % 2 === 1);
        const run = vi.fn(() => isOdd.state);
        effect(run);

        store.set('count', 3);
        expect(run).toHaveBeenCalledTimes(1);
        store.set('count', 4);
        expect(run).toHaveBeenCalledTimes(2);
    });

    it('runs the cleanup before the next run and on dispose', () => {
        const store = new Store({ value: 1 });
        const log: string[] = [];
        const dispose = effect(() => {
            const { value } = store.state;
            log.push(`run ${value}`);
            return () => log.push(`cleanup ${value}`);
        });

        store.set('value', 2);
        dispose();
        dispose();
        expect(log).toEqual(['run 1', 'cleanup 1', 'run 2', 'cleanup 2']);
    });

    it('may change stores, including the ones it reads', () => {
        const source = new Store({ value: 1 });
        const target = new Store({ value: 0 });
        const onTarget = vi.fn();
        target.subscribe(onTarget);

        effect(() => {
            target.set('value', source.state.value * 2);
        });
        expect(target.state.value).toBe(2);
        expect(onTarget).toHaveBeenCalledTimes(1);

        source.set('value', 2);
        expect(target.state.value).toBe(4);

        // Clamps its own input: runs again with the corrected value, then settles.
        const clamped = new Store({ value: 0 });
        const run = vi.fn(() => {
            if (clamped.state.value > 10) {
                clamped.set('value', 10);
            }
        });
        effect(run);
        clamped.set('value', 50);
        expect(clamped.state.value).toBe(10);
        expect(run).toHaveBeenCalledTimes(3);
    });

    it('runs before the listeners, which see the state it settled', () => {
        const store = new Store({ open: true, status: 'idle' });
        const order: string[] = [];
        store.subscribe((state) => order.push(`listener ${state.open} ${state.status}`));
        effect(() => {
            if (!store.state.open && store.state.status !== 'closed') {
                store.set('status', 'closed');
            }
            order.push(`effect ${store.state.open}`);
        });

        store.set('open', false);
        expect(order).toEqual(['effect true', 'effect false', 'effect false', 'listener false closed']);
    });

    it('reports errors of a re-run from the change that caused it and keeps running', () => {
        const store = new Store({ value: 1 });
        const run = vi.fn(() => {
            if (store.state.value < 0) {
                throw new Error('negative');
            }
        });
        effect(run);

        expect(() => store.set('value', -1)).toThrow('negative');
        store.set('value', 2);
        expect(run).toHaveBeenCalledTimes(3);
    });

    it('keeps a computed dependency linked while it runs', () => {
        const store = new Store({ value: 1 });
        const double = computed(() => store.state.value * 2);
        const dispose = effect(() => {
            double.state;
        });
        expect(double.observers.size).toBe(1);
        expect(store.observers.has(double)).toBe(true);

        dispose();
        expect(store.observers.size).toBe(0);
    });
});

// The package has no DOM or Node.js typings: the runtime globals the tests use.
declare function setTimeout(callback: (value?: unknown) => void, delay?: number): unknown;
declare type AbortSignal = { readonly aborted: boolean };
declare class AbortController {
    readonly signal: AbortSignal;
    abort(): void;
}

describe('effect scope', () => {
    const settle = () => new Promise((resolve) => setTimeout(resolve));

    it('does not track reads after an await on its own', async () => {
        const before = new Store({ value: 1 });
        const after = new Store({ value: 1 });
        const run = vi.fn(async () => {
            void before.state.value;
            await Promise.resolve();
            void after.state.value;
        });
        effect(run);
        await settle();

        after.set('value', 2);
        expect(run).toHaveBeenCalledTimes(1);
        before.set('value', 2);
        expect(run).toHaveBeenCalledTimes(2);
    });

    it('tracks reads after an await inside scope.run', async () => {
        const id = new Store({ value: 1 });
        const locale = new Store({ value: 'en' });
        const rendered: string[] = [];
        effect(async (scope) => {
            const current = id.state.value;
            await Promise.resolve();
            scope.run(() => {
                rendered.push(`${current} ${locale.state.value}`);
            });
        });
        await settle();
        expect(rendered).toEqual(['1 en']);

        locale.set('value', 'ru');
        await settle();
        expect(rendered).toEqual(['1 en', '1 ru']);
        expect(locale.observers.size).toBe(1);
    });

    it('ignores the scope of an outdated run', async () => {
        const trigger = new Store({ value: 1 });
        const late = new Store({ value: 1 });
        const scopes: Array<{ run<T>(fn: () => T): T; readonly active: boolean }> = [];
        const run = vi.fn((scope: (typeof scopes)[number]) => {
            void trigger.state.value;
            scopes.push(scope);
        });
        const dispose = effect(run);

        trigger.set('value', 2); // a new run: the first scope is outdated
        expect(scopes[0]?.active).toBe(false);
        expect(scopes[1]?.active).toBe(true);

        expect(scopes[0]?.run(() => late.state.value)).toBe(1);
        late.set('value', 2);
        expect(run).toHaveBeenCalledTimes(2); // the outdated read is not a dependency
        expect(late.observers.size).toBe(0);

        dispose();
        expect(scopes[1]?.active).toBe(false);
    });

    it('records scope.run reads made before the first await too', () => {
        const store = new Store({ value: 1 });
        const run = vi.fn((scope: { run<T>(fn: () => T): T }) => {
            scope.run(() => store.state.value);
        });
        effect(run);
        store.set('value', 2);
        expect(run).toHaveBeenCalledTimes(2);
    });

    it('cancels outdated async work with the cleanup', async () => {
        const id = new Store({ value: 1 });
        const results = new Store({ title: '' });
        const load = (value: number, signal: AbortSignal) =>
            new Promise<string>((resolve, reject) => {
                setTimeout(() => (signal.aborted ? reject(new Error('aborted')) : resolve(`item ${value}`)));
            });

        effect(() => {
            const controller = new AbortController();
            load(id.state.value, controller.signal)
                .then((title) => results.set('title', title))
                .catch(() => {});
            return () => controller.abort();
        });

        id.set('value', 2); // the first load is aborted
        await settle();
        await settle();
        expect(results.state.title).toBe('item 2');
    });
});
