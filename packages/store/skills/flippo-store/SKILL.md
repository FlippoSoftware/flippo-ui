---
name: flippo-store
description: Use when writing code with @flippo-software/store — Store, ComponentStore, computed, effect, batch, untracked, ReadTracker, deferNotifications/flushNotifications — or a framework adapter on it. Explains the update model and the patterns to use and avoid.
---

# Using @flippo-software/store

The full documentation is `node_modules/@flippo-software/store/README.md`; this is the working summary.

## Model

- `store.set(key, value)` / `update(partial)` / `setState(state)` apply **immediately**; `store.state` is current
  right away, even inside `batch`.
- Listeners (`subscribe`) are notified through **one queue shared by all stores**: once per changed store, with the
  latest state only, after the outermost `batch`.
- `computed(() => …)` is lazy and auto-tracked **per key** (`a.state.x` depends on `x` only); reads are always up to
  date. `effect(() => …)` re-runs when what it read changes, before listeners; it may return a cleanup.

```ts
import { batch, computed, effect, Store, untracked } from '@flippo-software/store';

const cart = new Store({ items: [] as { price: number }[], open: false });
const total = computed(() => cart.state.items.reduce((sum, item) => sum + item.price, 0));

const stop = effect(() => {
    badge.textContent = String(total.state); // re-runs when the total changes
});

batch(() => {
    cart.set('items', [{ price: 5 }]);
    cart.set('open', true);
}); // one notification per store
```

## Do

- Derive values with `computed`, not by writing stores from listeners.
- Use `effect` / `subscribe` only for side effects (DOM, timers, requests, callbacks).
- Give each list item its own `computed` when many readers derive a small answer from one key
  (`computed(() => list.state.activeIndex === index)`).
- Read without tracking with `untracked(() => …)`; wrap writes inside an effect in `untracked` when the written store
  is also read (otherwise the effect loops: the store throws after 100k notifications, naming the effect).
- Async effects: only synchronous reads are tracked; use `effect(async (scope) => { …await…; scope.run(() => read) })`,
  or better, write the async result to a store and read it.
- `ComponentStore` for component state: named selectors (`select(name, ...args)`), `context`, controlled values
  (`syncControlledValue(key, value)` — local writes to a controlled key are ignored).

## Don't

- Mutate `store.state` (use `set`/`update`).
- Write stores inside `computed` (throws).
- Count changes in listeners: they see only the latest state.
- Load two copies of the package (ESM + CJS, two versions): the queue would split. Deduplicate.

## Framework adapters

During a render, push state with `deferNotifications(() => machine.setOptions(options))`; after the commit (React:
layout effect) call `flushNotifications()` and run side effects (`afterCommit`). Subscribe UI to exactly what it read
with `ReadTracker` (`track(fn)`, `sources`, `hasChanged()`).
