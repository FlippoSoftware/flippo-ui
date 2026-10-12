# @flippo-software/hooks — notes for agents

Generic React hooks used by `@flippo-software/react-components` and apps, plus the React adapter of
`@flippo-software/store` (`useStore`, `ReactStore`). Peer dependencies: React 19. No README yet (the file `REASME.md`
is empty) — this file is the map.

## Layout

```
src/hooks/<useName>/index.ts + <useName>.ts   one folder per hook; each is an entry point `@flippo-software/hooks/use-name`
src/hooks/index.ts                            re-exports every hook
src/hooks/useStore/                           React adapter of the store:
  useStore.ts                                 useStore(store, selector, ...args) on useSyncExternalStore
  ReactStor.ts                                ReactStore extends ComponentStore: useState, useControlledProp,
                                              useContextCallback, useStateSetter, useSyncedValue(s)…
  Store.ts, createSelector.ts                 re-exports from @flippo-software/store (single copy of the queue)
src/lib/                                      small DOM/utility helpers (owner, contains, detectBrowser, clamp…)
scripts/generate-exports.js                   writes package.json `exports` from the built hooks
```

Hooks: animation frame/finished, click outside, clipboard, color scheme, controlled state, did update, document
title, drag gesture, event callback, event listener, eye dropper, favicon, file dialog, focus (+ return, trap,
within), forced rerendering, fullscreen, hash, hotkeys, hover, id, idle, in viewport, intersection, interval,
first render, iso layout effect, latest/lazy refs, local storage, long press, media query, merged ref, mouse, move,
mutation observer, network, on mount/first render, open change complete, open interaction type, orientation, OS,
previous value, ref as state, resize observer, scroll into view, scroll lock, scroll spy, SSR, stable callback,
status/transition status, store, text selection, timeout, unmount, value as ref, value changed, viewport size,
window event, window scroll.

## Rules

- Build: `pnpm build` = Vite + `scripts/generate-exports.js` (exports use kebab-case names). No test script yet.
- `ReactStore` adds hooks only; store logic belongs in `@flippo-software/store` (`link:` dependency). Keep the
  re-exports so apps get one copy of the store.
- The package is consumed by headless via `link:../hooks` and is not published in its current form: never commit,
  push or publish unless asked.
