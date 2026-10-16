# @flippo-software/store — notes for agents

The reactive layer under the Flippo UI stack: observable stores, derived values and effects, with one notification
queue shared by all stores. Used by `@flippo-software/core-components` (state machines), `@flippo-software/react-hooks` (React
adapter `ReactStore`/`useStore`) and `@flippo-software/web-components`. No dependencies, no DOM, no framework.

`README.md` is the user documentation and the spec of the behaviour: read the relevant section before changing
anything, and update it with every behaviour change.

## Layout

| File | Contents |
| --- | --- |
| `src/runtime.ts` | The shared queue: `batch`, `deferNotifications`, `flushNotifications`, `untracked`, dependency tracking of the running computation, pending effects, the 100k-notifications loop guard. |
| `src/Store.ts` | `Store`: `state` (a Proxy recording the keys read while tracking), `set`/`update`/`setState`/`replaceState`, `subscribe`, `notifyAll`, `peek()` (raw state for write paths). |
| `src/ComponentStore.ts` (+ `.types.ts`) | `Store` + `context`, named selectors (`select`, `getSelector`), `observe`, controlled values (`syncControlledValue`), `syncValue(s)`, `setContextValue`, `createSetter`. |
| `src/Computed.ts` | `computed`: lazy, auto-tracked, change detection by reference; linked (subscribed) values get a `stale` flag, unlinked ones check against a global `epoch`. |
| `src/Effect.ts` | `effect(run)`: re-runs through the queue before listeners; cleanup; `scope.run` / `scope.active` for async effects. |
| `src/ReadTracker.ts` | For adapters: records the sources read inside `track(fn)` (`sources`, `hasChanged()`, `ignore` option). |
| `src/createSelector.ts` (+ `.types.ts`) | `createSelector`, `createSelectorMemoized`. |
| `src/index.ts` | Explicit public exports. |

## Invariants (do not break them)

- State changes apply immediately; listeners are notified through the shared queue, once per changed store, with the
  latest state, in the order stores first changed. Effects run before store/computed listeners.
- Change detection is by reference (`Object.is` on the keys read / the computed value). The user rejected numeric
  versions — do not reintroduce them.
- Key-level tracking: a reader depends only on the keys it read; spreading / `Object.keys` depends on the whole state.
  Write paths must use the raw state (`peek()`), never the tracking Proxy.
- `notifyAll` notifies `subscribe` listeners only; it does not re-run computed values, effects or tracked reads.
- `compute` must not write stores (throws); cycles throw.
- One copy of the package per app: the queue is module state.

## Conventions

- Error messages start with `Flippo store:`.
- Public types live in `types.ts`, `ComponentStore.types.ts`, `createSelector.types.ts`; avoid casts.
- Every behaviour has a test next to the source (`*.test.ts`), including ordering and batching cases.

## Commands

`pnpm test`, `pnpm typecheck`, `pnpm lint:check`, `pnpm build`. Consumers use the built `dist/` (workspace
dependency): rebuild after changes, then run the tests of `core-components`, `react-components` and `web-components`.

Never commit, push or publish unless asked.
