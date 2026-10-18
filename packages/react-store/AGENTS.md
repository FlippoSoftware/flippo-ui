# @flippo-software/react-store — notes for agents

The React adapter of `@flippo-software/store` (`../store`): `useStore` (`useSyncExternalStoreWithSelector`) and
`ReactStore` (`ComponentStore` + hooks). The store logic stays in `@flippo-software/store`; this package only connects
it to React. `README.md` is the user documentation.

- `src/useStore.ts`, `src/ReactStore.ts`; `src/lib/` holds private React helpers (`useIsoLayoutEffect`,
  `useStableCallback`, `useLazyRef`) so the package depends on nothing but the store and React. Do not export them.
- `src/index.ts` re-exports the store's API: an app imports one copy of the store (its notification queue is module state).
- The public API is guarded by API Extractor (`etc/react-store.api.md`): after an intended change run `pnpm api:report`.
- Tests: Vitest + happy-dom + Testing Library (`src/*.test.tsx`).
- Commands: `pnpm build`, `pnpm test`, `pnpm lint:check`, `pnpm typecheck`. Never commit, push or publish unless asked.
