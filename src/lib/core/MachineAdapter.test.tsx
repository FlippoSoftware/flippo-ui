import React from 'react';

import { computed, Store } from '@flippo-software/core-components/store';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMachine } from './useMachine';
import { useMachineState } from './useMachineState';
import { useStoreState } from './useStoreState';
import { useTracker } from './useTracker';

type Options = { label: string };

/**
 * A minimal machine recording its lifecycle.
 */
class FakeMachine {
    static log: string[] = [];

    readonly listeners = new Set<() => void>();

    readonly store = {
        subscribe: (listener: () => void) => {
            this.listeners.add(listener);
            return () => this.listeners.delete(listener);
        }
    };

    private options: Options;

    private count = 0;

    constructor(options: Options) {
        this.options = options;
        FakeMachine.log.push(`create ${options.label}`);
    }

    setOptions(options: Options) {
        this.options = options;
        FakeMachine.log.push(`setOptions ${options.label}`);
    }

    getState() {
        return { label: this.options.label, count: this.count };
    }

    connect = () => {
        FakeMachine.log.push('connect');
        return () => FakeMachine.log.push('disconnect');
    };

    increment() {
        this.count += 1;
        for (const listener of this.listeners) {
            listener();
        }
    }
}

let machineRef: FakeMachine | null = null;

function Component({ label }: Options) {
    const machine = useMachine((options) => new FakeMachine(options), { label });
    machineRef = machine;
    const state = useMachineState(machine);
    return <span>{`${state.label}:${state.count}`}</span>;
}

/**
 * A machine whose `setOptions` writes to a store other components read.
 */
class SharedValueMachine {
    readonly store: Store<{ value: string }>;

    constructor(store: Store<{ value: string }>) {
        this.store = store;
    }

    setOptions(options: { value: string }) {
        this.store.set('value', options.value);
    }
}

function Writer({ store, value }: { store: Store<{ value: string }>; value: string }) {
    useMachine(() => new SharedValueMachine(store), { value });
    return null;
}

function Reader({ store }: { store: Store<{ value: string }> }) {
    return <output>{useStoreState(store).value}</output>;
}

describe('useMachine', () => {
    it('sets options before connecting and disconnects on unmount', () => {
        FakeMachine.log = [];
        const { unmount } = render(<Component label='a' />);
        expect(FakeMachine.log).toEqual(['create a', 'setOptions a', 'connect']);
        unmount();
        expect(FakeMachine.log.at(-1)).toBe('disconnect');
    });

    it('reconnects the same instance in StrictMode', () => {
        FakeMachine.log = [];
        render(<Component label='a' />, { reactStrictMode: true });
        expect(FakeMachine.log.filter((entry) => entry === 'connect' || entry === 'disconnect')).toEqual([
            'connect',
            'disconnect',
            'connect'
        ]);
    });

    it('re-renders when new options change the state, and on store changes', () => {
        const { container, rerender } = render(<Component label='a' />);
        expect(container).toHaveTextContent('a:0');

        rerender(<Component label='b' />);
        expect(container).toHaveTextContent('b:0');

        act(() => machineRef?.increment());
        expect(container).toHaveTextContent('b:1');
    });

    it('notifies other components of store changes made by setOptions after the render', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        const store = new Store({ value: 'a' });
        // The reader renders before the writer, so it only learns about the change from the notification.
        const { container, rerender } = render(
            <React.Fragment>
                <Reader store={store} />
                <Writer store={store} value='a' />
            </React.Fragment>
        );
        rerender(
            <React.Fragment>
                <Reader store={store} />
                <Writer store={store} value='b' />
            </React.Fragment>
        );
        expect(container).toHaveTextContent('b');
        expect(error).not.toHaveBeenCalled();
        error.mockRestore();
    });
});

/**
 * A machine whose state reads several stores, none of them called `store`.
 */
class SplitMachine {
    readonly flag = new Store({ on: true });

    readonly a = new Store({ value: 'a0' });

    readonly b = new Store({ value: 'b0' });

    readonly label = computed(() => `${this.a.state.value}!`);

    readonly extra = new Store({ count: 0 });

    getState() {
        return { picked: this.flag.state.on ? this.a.state.value : this.b.state.value, label: this.label.state };
    }

    getProps() {
        return { 'data-count': this.extra.state.count };
    }
}

describe('dependency tracking', () => {
    function StateView({ machine, onRender }: { machine: SplitMachine; onRender: () => void }) {
        onRender();
        const state = useMachineState(machine);
        return <span>{`${state.picked} ${state.label}`}</span>;
    }

    it('subscribes to the stores and computed values getState reads, and follows conditional reads', () => {
        const machine = new SplitMachine();
        const onRender = vi.fn();
        const { container } = render(<StateView machine={machine} onRender={onRender} />);
        expect(container).toHaveTextContent('a0 a0!');

        act(() => machine.a.set('value', 'a1'));
        expect(container).toHaveTextContent('a1 a1!');

        act(() => machine.flag.set('on', false));
        expect(container).toHaveTextContent('b0 a1!');

        act(() => machine.b.set('value', 'b1'));
        expect(container).toHaveTextContent('b1 a1!');

        const renders = onRender.mock.calls.length;
        act(() => machine.extra.set('count', 1)); // not read by getState
        expect(onRender).toHaveBeenCalledTimes(renders);
    });

    it('does not re-render when the state stays shallowly equal', () => {
        const machine = new SplitMachine();
        const onRender = vi.fn();
        render(<StateView machine={machine} onRender={onRender} />);
        const renders = onRender.mock.calls.length;

        act(() => machine.flag.set('on', true)); // no change
        act(() => machine.b.set('value', 'b1')); // read only when `on` is false
        expect(onRender).toHaveBeenCalledTimes(renders);
    });

    it('re-renders on changes of the stores read inside track', () => {
        const machine = new SplitMachine();

        function PropsView() {
            const track = useTracker();
            const props = track(() => machine.getProps());
            return <span {...props}>{props['data-count']}</span>;
        }

        const { container } = render(<PropsView />, { reactStrictMode: true });
        expect(container).toHaveTextContent('0');

        act(() => machine.extra.set('count', 2));
        expect(container).toHaveTextContent('2');
    });

    it('catches changes made after the render read a store and before it subscribed', () => {
        const machine = new SplitMachine();

        function PropsView() {
            const track = useTracker();
            const props = track(() => machine.getProps());
            return <span>{props['data-count']}</span>;
        }

        function LateWriter() {
            React.useLayoutEffect(() => {
                machine.extra.set('count', 5);
            }, []);
            return null;
        }

        const { container } = render(
            <React.Fragment>
                <PropsView />
                <LateWriter />
            </React.Fragment>
        );
        expect(container).toHaveTextContent('5');
    });
});
