import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReactStore, Store, useStore } from './index';

afterEach(cleanup);

describe('useStore', () => {
    it('re-renders when the selected value changes, not for other keys', () => {
        const store = new Store({ count: 0, other: 'a' });
        const renders = vi.fn();
        function Counter() {
            const count = useStore(store, (state) => state.count);
            renders(count);
            return <span>{count}</span>;
        }
        const view = render(<Counter />);
        act(() => store.set('other', 'b'));
        expect(renders).toHaveBeenCalledTimes(1);
        act(() => store.set('count', 1));
        expect(view.container.textContent).toBe('1');
        expect(renders).toHaveBeenCalledTimes(2);
    });

    it('passes the extra arguments to the selector', () => {
        const store = new Store({ items: ['a', 'b'] });
        function Item({ index }: { index: number }) {
            return <span>{useStore(store, (state, at: number) => state.items[at], index)}</span>;
        }
        expect(render(<Item index={1} />).container.textContent).toBe('b');
    });
});

describe('ReactStore', () => {
    const selectors = { open: (state: { open: boolean }) => state.open };

    it('reads a registered selector with useState', () => {
        const store = new ReactStore({ open: false }, {}, selectors);
        function Trigger() {
            return <span>{String(store.useState('open'))}</span>;
        }
        const view = render(<Trigger />);
        act(() => store.set('open', true));
        expect(view.container.textContent).toBe('true');
    });

    it('follows a controlled value and ignores local writes', () => {
        const store = new ReactStore({ open: false }, {}, selectors);
        function Root({ open }: { open: boolean | undefined }) {
            store.useControlledProp('open', open);
            return <span>{String(store.useState('open'))}</span>;
        }
        const view = render(<Root open={true} />);
        expect(view.container.textContent).toBe('true');
        act(() => store.set('open', false));
        expect(store.state.open).toBe(true);
        view.rerender(<Root open={undefined} />);
        act(() => store.set('open', false));
        expect(view.container.textContent).toBe('false');
    });

    it('keeps the latest context callback behind a stable function', () => {
        const store = new ReactStore<{ value: number }, { onChange: (value: number) => void }>({ value: 0 }, { onChange: () => {} });
        const first = vi.fn();
        const second = vi.fn();
        function Root({ onChange }: { onChange: (value: number) => void }) {
            store.useContextCallback('onChange', onChange);
            return null;
        }
        const view = render(<Root onChange={first} />);
        const stable = store.context.onChange;
        view.rerender(<Root onChange={second} />);
        expect(store.context.onChange).toBe(stable);
        store.context.onChange(1);
        expect(second).toHaveBeenCalledWith(1);
        expect(first).not.toHaveBeenCalled();
    });
});
