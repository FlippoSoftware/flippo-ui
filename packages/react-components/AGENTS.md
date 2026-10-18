# @flippo-software/react-components — notes for agents

Unstyled, accessible React components with the Base UI API (`Dialog.Root`, `Dialog.Trigger`, …). Every component is
a thin React adapter over the state machines of `@flippo-software/core-components` (`../core-components`): the machine owns the
behaviour; the component creates it, pushes props, renders and subscribes. `README.md` is the user documentation;
this file is the map.

## Layout

```
src/components/<Name>/            one folder per part: root/, trigger/, popup/, …  <Name><Part>.tsx (the DataAttributes and
                                  CssVars enums are core's: import them from `@flippo-software/core-components/<name>`)
src/components/<Name>/index.ts    `export * as <Name> from './index.parts'` + `export type *`
src/components/<Name>/index.parts.ts   `export { DialogRoot as Root } …` — the public part names
src/components/<Name>/<Name>.test.tsx  behaviour tests (default + StrictMode)
src/lib/core/                     the adapter layer: useMachine, useMachineState, useTracker, useStoreState,
                                  useStoreSelector, useSelector, useSyncDuringRender, toReactProps
src/lib/floating/                 FloatingPortal, FocusGuards, FloatingTree/FloatingNode (React side of core floating)
src/lib/hooks/                    useRenderElement (render/className/state attributes), useHeadlessUiId, useDirection…
src/test/renderModes.ts           RENDER_MODES (default, StrictMode)
```

## The adapter pattern

```tsx
const machine = useMachine((options) => new XMachine(options, setup), { ...props }); // setOptions every render (deferred notifications)
const state = useMachineState(machine);       // re-renders when what getState() read changes
const track = useTracker();                   // track(() => toReactProps(machine.getXProps(props))) for prop reads
return useRenderElement('button', componentProps, {
    state, ref: [ref, machine.setElement],
    props: [elementProps, (props) => track(() => toReactProps(machine.getXProps(props)))],
    customStyleHookMapping
});
```

- `useMachine`: machine created once (`useState`), `setOptions` during render inside `deferNotifications`,
  `flushNotifications` + `afterCommit()` in a layout effect, `connect()` in a layout effect (StrictMode reconnects).
- Trackers use `ReadTracker({ ignore: isOptionsStore })`: options are new every render.
- Roots pass generated ids (`useHeadlessUiId`) and `flushSync: ReactDOM.flushSync` in the setup; popups render their
  portal with `FloatingPortal` and pass its controller as `portal` to the machine; `FocusGuards` renders a
  `FocusManager`'s guards.
- Composite families (Toolbar, Tabs, Radio, Menu, Select…) use the core `CompositeRootMachine`/`ListRegistry` via
  `CompositeList`/`CompositeMachineProvider`; never nest a React-only composite inside a core one.
- Providers keep their legacy context shape, built from the machine, and add the machine itself.

## Rules

- Behaviour changes go to core, then the adapter. Rebuild core (`pnpm --filter @flippo-software/core-components build`,
  or `pnpm dev` at the workspace root) — this package uses core's `dist/` (`workspace:^`).
- Tests: `@flippo-software/internal-test-utils` (`createRenderer`, `screen`, user events), `describe.each(RENDER_MODES)`.
  Write the test against the expected Base UI behaviour first.
- Build is Vite (+ `tsc -p tsconfig.build.json` and `scripts/rewrite-dts-aliases.mjs` for types); do not move it to
  tsdown. TypeScript 7.
- `@flippo-software/react-hooks` is its own repository (`../../../hooks`, a published dependency; linked from the
  sibling checkout until its first release, see the root `pnpm-workspace.yaml`); `@flippo-software/internal-test-utils`
  comes from the workspace (`workspace:*`, private, tests only).

## Commands

`pnpm lint:check` (or `pnpm lint:changed`), `pnpm typecheck`, `pnpm test`, `pnpm build` (from the workspace root:
`pnpm --filter @flippo-software/react-components <script>`).
Never commit, push or publish unless asked.
