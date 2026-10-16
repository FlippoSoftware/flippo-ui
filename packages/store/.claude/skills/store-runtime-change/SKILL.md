---
name: store-runtime-change
description: Use when changing @flippo-software/store itself — the notification queue, Store, ComponentStore, computed, effect, ReadTracker or selectors. Covers the invariants to keep, the tests to add and how to check the packages built on it.
---

# Changing the store

The store is the base of every Flippo UI package; a change in ordering or tracking shows up as subtle UI bugs far
away. Work in this order.

1. **Read the spec first.** Find the README section of what you change (`How updates work`, `Notifications and
   batch`, `Computed values`, `Effects`, `ComponentStore`, `Writing a framework adapter`, `Pitfalls`). The README
   describes the intended behaviour; the change must keep it or update it on purpose.
2. **Check the invariants** listed in `AGENTS.md` (immediate state, one shared queue, effects before listeners,
   reference-based change detection, key-level tracking with `peek()` on write paths, `notifyAll` scope).
3. **Write the test first**, next to the source (`src/<Module>.test.ts`). Cover:
   - the order of notifications across several stores and inside `batch` / `deferNotifications`;
   - that listeners get the latest state only;
   - for tracking: which keys are dependencies, conditional reads, spreading the state;
   - for computed values: linked (with listeners) and unlinked reads, diamonds, `equals`;
   - for effects: cleanup, re-run after a dependency change, `untracked`, async `scope.run`.
4. **Implement** in the module that owns the concern (`runtime.ts` for queue/tracking state). Keep public types in
   the `*.types.ts` / `types.ts` files and exports explicit in `src/index.ts`.
5. **Update the README** (behaviour, examples, API reference table) in the same change.
6. **Verify downstream:**
   ```sh
   pnpm lint:check && pnpm typecheck && pnpm test && pnpm build
   (cd ../core-components && pnpm test && pnpm build)
   (cd ../react-components && pnpm test)
   (cd ../web-components && pnpm test)
   ```
   An infinite update loop shows as `Flippo store: more than 100000 notifications in one flush …` naming the effect:
   usually an effect that writes what it reads — wrap the write (or the call that reads and writes) in `untracked`.
