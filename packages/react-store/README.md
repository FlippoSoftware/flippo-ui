# @flippo-software/react-store

The React adapter of [`@flippo-software/store`](../store): `useStore` subscribes a component to a slice of a store,
`ReactStore` is a `ComponentStore` with hooks for the components built on it.

> **Status: not yet released.** Formerly part of `@flippo-software/react-hooks`.

## Install

```sh
pnpm add @flippo-software/react-store
```

React 19 is a peer dependency. `@flippo-software/store` comes with the package.

## Usage

`useStore` subscribes a component to a slice of any `Store`; `ReactStore` is a `ComponentStore` with hooks for
components built on it. A component re-renders only when the value it selected changes.

```tsx
import { ReactStore, type Store, useStore } from '@flippo-software/react-store';

function Counter({ store }: { store: Store<{ count: number }> }) {
    const count = useStore(store, (state) => state.count);
    return <span>{count}</span>;
}
```

A component store belongs to one instance of the component: the root creates it once (`useState` with an
initializer, not at module level, so every instance and every server request gets its own) and passes it to its
parts through context:

```tsx
type PopoverStore = ReactStore<PopoverState, PopoverStoreContext, typeof selectors>;

const PopoverContext = React.createContext<PopoverStore | null>(null);

function PopoverRoot(props: PopoverRootProps) {
    const [store] = React.useState(() => new ReactStore(initialState, initialContext, selectors));
    store.useControlledProp('open', props.open); // controlled or uncontrolled `open`
    store.useContextCallback('onOpenChange', props.onOpenChange); // always the latest callback
    return <PopoverContext.Provider value={store}>{props.children}</PopoverContext.Provider>;
}

function PopoverTrigger() {
    const store = React.useContext(PopoverContext)!;
    const open = store.useState('open');
    const setTrigger = store.useStateSetter('triggerElement'); // stable ref callback
    return <button ref={setTrigger} aria-expanded={open} />;
}
```

The package re-exports `Store`, `ComponentStore` and the selector helpers of `@flippo-software/store`, so an app
uses one copy of the store (the notification queue is module state).
## API

| Export | What it does |
| --- | --- |
| `useStore(store, selector, ...args)` | The value `selector(state, ...args)`; re-renders when it changes (`useSyncExternalStore` with a selector). |
| `ReactStore` | `ComponentStore` plus `useState(key)`, `useControlledProp`, `useSyncedValue(s)`, `useSyncedValueWithCleanup`, `useContextCallback`, `useStateSetter`. |
| `Store`, `ComponentStore`, `computed`, `effect`, `batch`, selectors… | Re-exported from `@flippo-software/store`. |

The public API is checked by API Extractor (`etc/react-store.api.md`, part of `lint:check`).

## Development

```sh
pnpm --filter @flippo-software/react-store test
pnpm --filter @flippo-software/react-store api:report   # after an intended API change
```

See the [repository README](../../README.md).
