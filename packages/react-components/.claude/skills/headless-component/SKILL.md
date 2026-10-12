---
name: headless-component
description: Use when adding or changing a React component or part in @flippo-software/react-components (Base UI API on core machines) — wiring a core machine with useMachine/useMachineState/useTracker, render props, state attributes, portals, focus guards, and writing its tests in default and StrictMode.
---

# Adding or changing a headless React component

1. **Behaviour lives in core.** If the machine lacks something, change `../core` first (skill `core-machine` there),
   `pnpm build:core`, then come back.
2. **Copy the closest sibling.** Simple part: `src/components/Toggle/Toggle.tsx`; popup family: `Popover/`; list:
   `Select/`, `Menu/`; form control: `Checkbox/` (Field/Labelable contexts). Keep the Base UI prop names, defaults
   and JSDoc.
3. **Part file** `src/components/<Name>/<part>/<Name><Part>.tsx`:
   - `useMachine((options) => new XMachine(…, setup), options)` — props → options; defaults in destructuring.
   - `useMachineState(machine)` for the state passed to `useRenderElement` (and its state attribute mapping).
   - Props through `track(() => toReactProps(machine.getXProps(props)))` (`useTracker()`), refs to the machine's
     element setters.
   - Roots: ids from `useHeadlessUiId`, `flushSync: ReactDOM.flushSync`, context providers built from the machine.
   - Popups: `FloatingPortal` → pass the controller as `portal`; `FocusGuards` around the popup; `FloatingTree` /
     `FloatingNode` for nested popups.
   - Never call user callbacks during render: machines report them from listeners or `afterCommit`.
4. **Exports:** add the part to `index.parts.ts` (`export { XRoot as Root }`), types to `index.ts`
   (`export type * from`), and the component to `src/components/index.ts`; `pnpm build:exports` updates
   `package.json` exports.
5. **Tests** in `<Name>.test.tsx`:
   ```tsx
   describe.each(RENDER_MODES)('X ($name)', ({ reactStrictMode }) => {
       const { render } = createRenderer({ reactStrictMode });
       it('…', async () => { const { user } = render(<X.Root>…</X.Root>); … });
   });
   ```
   Cover ARIA, data attributes, keyboard, pointer, controlled/uncontrolled, callbacks with `eventDetails`, and for
   lists that only the affected items re-render.
6. **Check:** `pnpm lint:changed && pnpm typecheck && pnpm test && pnpm build`. If core changed, also run the core
   tests and `../web-components` tests.
