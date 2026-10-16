# @flippo-software/store

A small framework-agnostic observable store used by the Flippo UI state machines
(`@flippo-software/core-components`) and by the React adapter in `@flippo-software/react-hooks`.

It works anywhere JavaScript runs (browsers, Node.js, workers) and has no dependencies.

- [Install](#install)
- [Quick start](#quick-start)
- [How updates work](#how-updates-work)
- [`Store`](#store)
- [Notifications and `batch`](#notifications-and-batch)
- [Computed values](#computed-values)
- [Effects](#effects)
- [`ComponentStore`](#componentstore)
- [Selectors](#selectors)
- [Using it with React](#using-it-with-react)
- [Writing a framework adapter](#writing-a-framework-adapter)
- [Pitfalls](#pitfalls)
- [API reference](#api-reference)

## Install

```sh
pnpm add @flippo-software/store
```

## Quick start

```ts
import { Store } from '@flippo-software/store';

const counter = new Store({ count: 0 });

const unsubscribe = counter.subscribe((state) => {
    console.log('count:', state.count);
});

counter.set('count', 1); // logs "count: 1"
counter.update({ count: 2 }); // logs "count: 2"
counter.set('count', 2); // nothing: the value did not change

unsubscribe();
```

## How updates work

Three rules describe the whole store:

1. **State changes apply immediately.** After `set`, `update` or `setState` returns, `store.state` holds the new
   value, even inside a batch.
2. **Listeners are notified through one queue shared by all stores.** Every changed store is notified once, with its
   latest state, in the order the stores first changed. [Effects](#effects) whose dependencies changed run first, so
   listeners see the state they settled.
3. **Notifications run as soon as nothing holds them back.** Outside of [`batch`](#notifications-and-batch) they run
   before `set` returns; inside a batch they run when the outermost batch ends.

```
store.set('a', 1)
 ├─ store.state = { …, a: 1 }        rule 1: visible right away
 ├─ queue: [store]                   rule 2
 └─ flush (no batch is open)         rule 3
     └─ listeners of store(state)
```

## `Store`

```ts
const store = new Store({ open: false, value: '' });
```

| Member | What it does |
| --- | --- |
| `state` | The current state. Read it freely, never mutate it. |
| `getSnapshot()` | Returns `state`. Handy for `useSyncExternalStore`-like APIs. |
| `subscribe(listener)` | Calls `listener(state)` after every change. Returns an unsubscribe function. |
| `set(key, value)` | Changes one key. Does nothing if the value is the same (`Object.is`). |
| `update(changes)` | Merges several keys. Does nothing if none of them changes. |
| `setState(state)` | Replaces the whole state. Does nothing if it is the same object. |
| `notifyAll()` | Gives the state a new reference and notifies every `subscribe` listener, even if no value changed. Computed values and effects are not re-run: they react only to the keys they read. |

The state is immutable: every change creates a new object, so you can compare states by reference.

```ts
// ❌ listeners will never know about it
store.state.open = true;

// ✅
store.set('open', true);
```

`subscribe` does not call the listener with the current state. Read `store.state` when subscribing if you need it,
or use [`observe`](#observe-a-derived-value).

## Notifications and `batch`

### Several changes, one notification

Each change outside a batch notifies right away. When several changes belong together, wrap them in `batch`,
so listeners never see a half-applied update:

```ts
import { batch, Store } from '@flippo-software/store';

const filters = new Store({ query: '', sort: 'date' });
const list = new Store({ page: 3 });

list.subscribe(() => {
    // Without `batch`, this listener would run after the `query` change, while `sort` is still old.
    load(filters.state, list.state);
});

batch(() => {
    filters.set('query', 'abc');
    filters.set('sort', 'name');
    list.set('page', 1);
    console.log(filters.state.query); // 'abc': state is already updated
});
// Listeners run here: `filters` once (with both changes), then `list` once.
```

`batch` returns the result of its callback, and batches can be nested: only the outermost one notifies.

```ts
function resetFilters() {
    batch(() => {
        filters.update({ query: '', sort: 'date' });
        list.set('page', 1);
    });
}

batch(() => {
    resetFilters(); // does not notify yet
    list.set('page', 2);
}); // notifies here
```

If the callback throws, the error is rethrown, and the changes it had already made are still delivered to the
listeners, in a microtask.

### Listeners that change stores

A listener may change any store, including its own. The change is queued: the remaining listeners of the
current store run first, then the changed store is notified.

```ts
const a = new Store({ value: 0 });
const b = new Store({ value: 0 });

a.subscribe(() => {
    console.log('a1');
    b.set('value', 1); // queued; b's listeners have not run yet
});
a.subscribe(() => console.log('a2'));
b.subscribe(() => console.log('b'));

a.set('value', 1); // logs: a1, a2, b
```

When a listener changes its own store, listeners that have not run yet skip the intermediate state and get only
the final one:

```ts
const popup = new Store({ open: true, status: 'idle' });

popup.subscribe((state) => {
    if (!state.open && state.status !== 'closed') {
        popup.set('status', 'closed'); // reacts to its own store
    }
});
popup.subscribe((state) => console.log(state));

popup.set('open', false);
// logs once: { open: false, status: 'closed' }
// `{ open: false, status: 'idle' }` was never shown to the second listener
```

The queue keeps running until no store has unnotified changes. Listeners and effects that keep changing what they
depend on never settle: after 100 000 notifications in one flush, the flush stops with an error naming the last effect
or store, instead of freezing the page.

### Errors in listeners

A throwing listener does not stop the others. Every listener and every queued store is still notified,
then the error is rethrown from the call that started the flush (`set`, `update`, `batch`…). When several
listeners throw, you get an `AggregateError` with all of them.

```ts
store.subscribe(() => {
    throw new Error('boom');
});
store.subscribe(render); // still called

try {
    store.set('value', 1);
} catch (error) {
    // Error: boom
}
```

## Computed values

`computed` derives a value from stores and other computed values:

```ts
import { computed, Store } from '@flippo-software/store';

const cart = new Store({ items: [] as { price: number }[] });
const settings = new Store({ currency: 'EUR' });

const total = computed(() => {
    const sum = cart.state.items.reduce((acc, item) => acc + item.price, 0);
    return `${sum} ${settings.state.currency}`;
});

total.state; // '0 EUR'
total.subscribe((value) => render(value));
```

- **Dependencies are tracked automatically, key by key.** Every store and computed value read through `.state`
  (or `select`, `getSnapshot`) while computing becomes a dependency — and for a store, only the keys of its state
  that were read: `computed(() => popup.state.open)` is not recomputed when `popup.state.position` changes. Reading
  all keys (`Object.keys`, spreading the state) depends on the whole state. Dependencies are collected again on every
  computation, so conditional reads work: `computed(() => (flag.state.on ? a.state.value : b.state.value))` stops
  depending on `a` when `on` turns off.
- **It is lazy.** `compute` runs on the first read, and later only when the value is read and a dependency has
  changed since the last computation. A computed value nobody reads costs nothing.
- **Checking is cheap.** A dependency has changed when one of the keys read (or the computed value) is no longer the
  reference that was read.
  While a computed value has listeners, its dependencies mark it stale when they change, so reading it costs nothing
  until then, whatever happens to other stores. Without listeners, it compares its dependencies only if some store has
  changed since its last read.
- **Reads are always up to date**, including inside `batch` and `deferNotifications`, where listeners have not run
  yet:

  ```ts
  batch(() => {
      cart.set('items', [{ price: 5 }]);
      total.state; // '5 EUR'
  });
  ```

- **Listeners are notified in the same queue as stores**, after the stores it depends on, once per change, and only
  when the value actually changed.
- **Diamonds are consistent.** A value that depends on two computed values of the same store is computed once per
  change, with both inputs up to date.

A computed value has `state`, `getSnapshot()` and `subscribe()`, like a store (the `ReadableStore` interface), so
it can be used wherever a store is read, e.g. `useStore(total, (value) => value)` in React.

### Equality

A recomputed value that is equal to the previous one (by `Object.is`) keeps the previous value: nothing is notified,
and computed values that depend on it are not recomputed. When `compute` creates objects or arrays, pass `equals`
to keep the previous reference while the contents are the same:

```ts
const evenIds = computed(() => list.state.items.filter((item) => item.id % 2 === 0).map((item) => item.id), {
    equals: (a, b) => a.length === b.length && a.every((id, index) => id === b[index])
});
```

### Reading without tracking

`untracked` reads stores without making them dependencies:

```ts
const price = computed(() => cart.state.total * untracked(() => rates.state.current));
// recomputed when `cart` changes; a change of `rates` alone does not recompute it
```

### Rules

- **`compute` must not change stores.** Doing so throws an error, and the store keeps its value.
- **`compute` should have no side effects.** It runs lazily, when and as often as the value is read and outdated.
  Put side effects in an [`effect`](#effects) or a `subscribe` listener.
- **A computed value must not depend on itself.** A cycle throws an error.
- **Only stores and computed values are tracked.** Reading plain variables or object fields inside `compute` does not
  make it recompute when they change; keep such inputs in a store.
- **Errors of `compute` are rethrown** from the read (and from the flush that notifies its listeners). The next read
  tries again.

While a computed value has listeners, its dependencies hold a reference to it so that their changes can queue it.
Unsubscribe the last listener to release it; a computed value without listeners is only referenced by your code.

### Many readers of one key

Key tracking makes a reader depend on a key, not on what it derives from it. When many readers derive a small answer
from the same key — say, each item of a list checks whether it is the active one — give each reader a `computed`
value, so that it depends on the answer:

```ts
// ❌ every item depends on `activeIndex`: moving the highlight re-runs all of them
const highlighted = () => list.state.activeIndex === index;

// ✅ every item depends on its own answer: moving the highlight changes it for two items
const highlighted = computed(() => list.state.activeIndex === index);
```

## Effects

`effect` runs a function now and again whenever a store or computed value it read changes. It is the reactive
counterpart of `subscribe`: there is no list of stores to keep in sync with the code, the reads are the list.

```ts
import { effect } from '@flippo-software/store';

const dispose = effect(() => {
    // Re-runs when `popup` changes, and when `settings` changes while the popup is open.
    element.hidden = !popup.state.open;
    if (popup.state.open) {
        element.dataset.theme = settings.state.theme;
    }
});

dispose(); // stops it
```

- **Dependencies are collected on every run**, key by key, like for `computed`, so conditional reads work and changes
  of other keys do not re-run it.
- **Re-runs go through the notification queue**: once per change (or once per `batch`), and only if a dependency
  really changed (a computed value that kept its value does not re-run it).
- **Effects run before listeners.** In a flush, the effects whose dependencies changed run first, including the ones
  queued by other effects; then the listeners of stores and computed values are notified. A state machine reacting to
  its own store with effects settles before the UI sees the state.
- **An effect may change stores**, including the ones it reads; the changes are queued. An effect that keeps writing
  new values to its own dependencies never settles.
- **A cleanup** returned by the function runs before the next run and when the effect is disposed:

  ```ts
  effect(() => {
      if (!popup.state.open) {
          return;
      }
      const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && popup.set('open', false);
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
  });
  ```

- **Only stores and computed values are tracked.** If an effect depends on a plain field (options, a ref), re-run it
  yourself when that field changes, or keep the value in a store. Use `untracked` for reads that must not re-run it.

### Async effects

Reads are tracked while the effect function runs **synchronously**. In an async function, the code after an `await`
runs later, when the effect is no longer being tracked, so its reads are not dependencies:

```ts
effect(async () => {
    const id = selection.state.id;     // tracked
    const item = await load(id);
    render(item, settings.state.locale); // NOT tracked: a change of `locale` does not re-run the effect
});
```

JavaScript gives libraries no way to follow a function across `await` (the TC39
[AsyncContext](https://github.com/tc39/proposal-async-context) proposal would), so there are two options:

- **Keep the async work out of the tracked part** — usually the clearest. Read synchronously, start the work, write
  the result to a store; what reads the store is tracked as usual. The cleanup cancels outdated work:

  ```ts
  effect(() => {
      const controller = new AbortController();
      load(selection.state.id, controller.signal).then((item) => results.set('item', item));
      return () => controller.abort(); // the id changed: the previous load is canceled
  });

  const title = computed(() => results.state.item?.title ?? '');
  ```

- **Continue tracking explicitly with `scope.run`.** The effect function gets a `scope`; reads inside `scope.run` are
  dependencies of that run, also after an `await`:

  ```ts
  effect(async (scope) => {
      const item = await load(selection.state.id);
      scope.run(() => render(item, settings.state.locale)); // `locale` is tracked
  });
  ```

  Once the effect has run again (or is disposed), the scope of the earlier run is outdated (`scope.active` is
  `false`): `scope.run` still runs the function, but does not track it, so the dependencies of an outdated run never
  mix with the current ones. Check `scope.active` to skip outdated work.

Errors thrown after an `await` reject the promise the function returns; the effect does not report them.

Prefer `effect` over `subscribe` when the reaction reads several stores: with `subscribe`, every store has to be
subscribed to separately, and a store read through a selector of another one is easy to miss.

## `ComponentStore`

`ComponentStore` is a `Store` for UI components and state machines. On top of `Store` it has named selectors,
a non-reactive context, controlled values and `observe`.

```ts
import { ComponentStore, createSelector } from '@flippo-software/store';

type State = { open: boolean; disabled: boolean; activeId: string | null };
type Context = { onOpenChange?: (open: boolean) => void; triggerRef: { current: HTMLElement | null } };

const selectors = {
    open: createSelector((state: State) => state.open),
    interactive: createSelector((state: State) => !state.disabled),
    isActive: createSelector((state: State, id: string) => state.activeId === id)
};

const store = new ComponentStore<State, Context, typeof selectors>(
    { open: false, disabled: false, activeId: null },
    { triggerRef: { current: null } },
    selectors
);

store.select('open'); // false
store.select('isActive', 'item-1'); // selectors can take up to three arguments
```

### Context

`context` holds values that must not trigger re-renders: callbacks, element refs, timers, registries.
Changing it does not notify anyone.

```ts
store.setContextValue('onOpenChange', (open) => console.log('open:', open));
store.context.triggerRef.current = button;
```

### Observe a derived value

`observe` calls the listener with the current value right away, then whenever the selected value changes
(by `Object.is`). It accepts a selector name or a function.

```ts
const stop = store.observe('open', (open, previous) => {
    console.log(`open: ${previous} → ${open}`);
});

store.observe(
    (state) => state.activeId,
    (id) => scrollIntoView(id)
);

stop();
```

### Controlled values

A UI component is often either *controlled* (the owner passes the value, e.g. `open`) or *uncontrolled*
(the component keeps its own value). `syncControlledValue` supports both:

```ts
// Called whenever the owner's props change:
store.syncControlledValue('open', props.open);
```

- If `props.open` is defined, the key is **controlled**: the store takes the value, and local writes to `open`
  (`set`, `update`, `setState`) are ignored. The component asks the owner to change the value instead.
- If `props.open` is `undefined`, the key is **uncontrolled**: the store keeps its own value and local writes work.

```ts
function requestOpen(open: boolean) {
    store.set('open', open); // ignored while controlled
    store.context.onOpenChange?.(open); // the owner decides
}

store.syncControlledValue('open', false); // controlled, closed
requestOpen(true); // onOpenChange(true) is called, store.state.open stays false
store.syncControlledValue('open', true); // the owner accepted: now open

store.isControlled('open'); // true
```

Switching a key between controlled and uncontrolled logs an error in development, like React does.

Other helpers for values that come from outside:

| Method | Use |
| --- | --- |
| `syncValue(key, value)` | Writes `value` if it differs. |
| `syncValues(values)` | Writes several values at once. |
| `syncValueWithCleanup(key, value)` | Writes `value` and returns a function that resets the key to `undefined` (e.g. when the part that owns the value goes away). |
| `createSetter(key)` | Returns `(value) => store.set(key, value)`, e.g. for ref callbacks. |

## Selectors

`createSelector` composes up to five input selectors and a combiner. Extra arguments (up to three) are passed
to every input selector and then to the combiner:

```ts
import { createSelector, createSelectorMemoized } from '@flippo-software/store';

const selectItem = createSelector(
    (state: State) => state.items,
    (state: State) => state.selectedIds,
    (items, selectedIds, index: number) => ({ item: items[index], selected: selectedIds.includes(items[index].id) })
);

selectItem(store.state, 2);
```

`createSelector` recomputes on every call. When the combiner creates a new object or array and its result is
used by a subscription (React re-renders when the result changes by `Object.is`), use `createSelectorMemoized`:
it returns the previous result while the inputs and arguments are the same.

```ts
const selectVisibleItems = createSelectorMemoized(
    (state: State) => state.items,
    (state: State) => state.query,
    (items, query) => items.filter((item) => item.label.includes(query))
);
```

The memoized selector keeps one cache per store (stored under a `__cacheKey__` property in the state), so one
selector can be shared by several stores.

## Using it with React

`@flippo-software/react-hooks` provides the React adapter:

```tsx
import { ReactStore, useStore } from '@flippo-software/react-hooks';

// Any Store: subscribe to a slice of the state.
function Counter({ store }: { store: Store<{ count: number }> }) {
    const count = useStore(store, (state) => state.count);
    return <span>{count}</span>;
}

// ReactStore = ComponentStore + hooks.
const store = new ReactStore(initialState, initialContext, selectors);

function Trigger(props: TriggerProps) {
    store.useControlledProp('open', props.open); // controlled / uncontrolled `open`
    store.useContextCallback('onOpenChange', props.onOpenChange); // always the latest callback
    const open = store.useState('open'); // re-renders when `open` changes
    const setTrigger = store.useStateSetter('triggerElement'); // stable ref callback

    return <button ref={setTrigger} aria-expanded={open} />;
}
```

A component re-renders only when its selected value changes, not on every change of the store.

## Writing a framework adapter

UI frameworks render first and commit later. While rendering, a component may push new options into a store,
but must not make other components update (React reports "Cannot update a component while rendering a different
component"). `deferNotifications` and `flushNotifications` split a change into these two phases:

```ts
import { deferNotifications, flushNotifications } from '@flippo-software/store';

// 1. While rendering: apply the state, hold back the listeners.
deferNotifications(() => machine.setOptions(options));
// children rendered after this point read the new store.state

// 2. After the render is committed (React: a layout effect):
flushNotifications(); // listeners run, once per changed store
```

This is what the React adapter of the Flippo UI components does:

```ts
function useMachine(create, options) {
    const [machine] = React.useState(() => create(options));

    deferNotifications(() => machine.setOptions(options));

    React.useLayoutEffect(() => {
        flushNotifications();
        machine.afterCommit?.(); // side effects of the new options (user callbacks, focus…)
    });

    React.useLayoutEffect(() => machine.connect(), [machine]);

    return machine;
}
```

How it behaves:

- **One flush serves every component.** The first `flushNotifications` of a commit notifies all stores changed during
  the render; the following ones find the queue empty.
- **Nothing is lost.** If no flush comes (for example, the framework threw the render away), the listeners run in a
  microtask.
- **`flushNotifications` inside `deferNotifications` or `batch` does nothing**, and so does a call during a running flush.
- **Code that runs inside `deferNotifications` must only change state.** User callbacks and DOM side effects belong
  to the commit phase (`afterCommit` above): they may run several times or not at all for a render.
- **On the server**, call `setOptions` directly: there are no listeners to defer.

Use `batch` everywhere else. `deferNotifications` exists only to carry notifications across the render/commit
boundary.

Computed values read during the render are already up to date: they do not wait for the flush.

## Pitfalls

**Derive values with `computed`, not with `subscribe`.** If store `b` is filled by a listener of store `a`, `b` lags
behind until the queue reaches `a`:

```ts
// ❌ b is stale inside a batch, and listeners of b may see it out of sync with a
a.subscribe((state) => b.set('double', state.value * 2));

batch(() => {
    a.set('value', 5);
    b.state.double; // still the old value: a's listeners have not run yet
});

// ✅ always up to date
const double = computed(() => a.state.value * 2);
```

Keep `effect` and `subscribe` for side effects: DOM updates, timers, network requests, user callbacks.

**Listeners do not see every intermediate state.** If several changes happen before a listener runs (in a batch, or
because an earlier listener changed the store), the listener gets only the latest state. Do not use listeners
to count changes or to log transitions; record transitions where they happen.

**Do not mutate `state`.** Listeners are not notified, and selectors comparing by reference miss the change.

**Install a single copy of the package.** The notification queue is shared by the stores of one copy of the
package. With two copies (two versions, or ESM and CommonJS builds loaded together), `batch` from one copy does
not hold back the stores of the other. Deduplicate the dependency (`pnpm dedupe`).

## API reference

| Export | Description |
| --- | --- |
| `Store` | State with `subscribe`, `getSnapshot`, `set`, `update`, `setState` and `notifyAll`. |
| `ComponentStore` | `Store` + `context`, named selectors (`select`, `getSelector`), `observe`, controlled values (`syncControlledValue`, `isControlled`), `syncValue(s)`, `syncValueWithCleanup`, `setContextValue`, `createSetter`. |
| `computed(compute, options?)` | Creates a `Computed` value derived from stores and computed values (`state`, `getSnapshot`, `subscribe`). `options.equals` decides when a new value equals the previous one. |
| `effect(run)` | Runs `run` now and whenever a store or computed value it read changes; `run` may return a cleanup, and gets a `scope` whose `scope.run(fn)` tracks reads after an `await`. Returns a function that stops it. |
| `untracked(fn)` | Runs `fn` without tracking its reads (as dependencies of a computed value or an effect). |
| `ReadTracker` | Records the stores and computed values read inside `track(fn)`, without caching; `sources` and `hasChanged()` let adapters subscribe to exactly them. `new ReadTracker({ ignore })` skips some sources (e.g. stores the adapter itself fills on every render). |
| `ReadableStore<State>` | What `Store` and `Computed` have in common: `state`, `getSnapshot()`, `subscribe()`. |
| `batch(fn)` | Runs `fn` and notifies the changed stores once, after the outermost batch. Returns the result of `fn`. |
| `deferNotifications(fn)` | For framework adapters: runs `fn` with notifications held until `flushNotifications` (or a microtask). |
| `flushNotifications()` | Notifies the stores and computed values with pending changes. Does nothing inside a batch, a deferral or a running flush. |
| `createSelector(...selectors, combiner)` | Composes selectors; recomputes on every call. |
| `createSelectorMemoized(...selectors, combiner)` | Same, but returns the previous result while the inputs are the same. |
| `Listener<State>` | Type of a `subscribe` listener: `(state: State) => void`. |

## Scripts

| Script | Description |
| --- | --- |
| `pnpm build` | Build ESM, CJS and declarations with tsdown |
| `pnpm test` | Run the tests |
| `pnpm typecheck` | Type-check with TypeScript |
| `pnpm lint:check` | Lint and check formatting with Biome |

Run them from the [`flippo-ui`](../../README.md) workspace root: `pnpm --filter @flippo-software/store <script>` (or
`pnpm check` for the whole workspace).
