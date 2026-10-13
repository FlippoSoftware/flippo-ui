# @flippo-software/web-components — notes for agents

Headless, accessible custom elements for every component of `@flippo-software/core-components` (`../core-components`). No Lit,
no runtime dependencies besides store and core; elements render no markup and no styles: the page's markup gets the
behaviour (ARIA, keyboard, pointer, state as `data-*`). Must work in plain HTML, React 19 and Vue 3.
`README.md` is the user documentation (usage, catalog of tags, differences from the React version).

## Layout

```
src/lib/                          the element runtime
  MachineElement.ts               base class: attributes ⇄ properties (withAttributes, property<T>()), options flushed in a
                                  microtask inside `batch`, one apply effect per target, as-child (chained), targetId()
  ContextPart.ts                  base for parts that need contexts (`contexts` tuple → `provided`)
  context.ts                      Context Community Protocol: createContext, provideContext, requestContext(s),
                                  requestAncestorContext(s), declareProvider, providesContext
  PropsApplier.ts                 React-shaped core props → DOM (events, aria, style, class, value/checked)
  topLayer.ts                     popups in the top layer (Popover API), showInTopLayerInOrder
  FocusGuards.ts, FallbackText.ts, FormControl.ts, ariaReferences.ts, registerElements.ts, createId.ts
src/components/<name>/
  root/<Name>Element.ts           the root element
  root/<Name>RootContext.ts       contexts, context tuples (<NAME>_ROOT…), part base classes, event detail types
  <part>/<Name><Part>Element.ts   one element per file (folder = kebab part name: trigger/, item-indicator/, …)
  utils/                          shared non-part classes (field/utils/ControlElement.ts)
  index.ts                        entry point: export * of the files, `elements` (part → class), `define(options)`
src/define.ts                     `components` (from every `elements`) and the root `define({ prefix, components? })`
src/index.ts                      re-exports every element file + define + lib
test/                             *.test.ts(x) per family; stubPopoverApi.ts, stubElementInternals.ts (happy-dom gaps)
```

## Principles (decided with the user — keep them)

- Tags are `<prefix>-<part>` with a required user prefix (`define({ prefix: 'ui' })`); classes grouped as
  `components.<component>.<part>`; each component is its own entry point (`/dialog`, `/menu`…).
- Never move or insert into framework-owned nodes: popups go to the top layer where they are; internal elements
  (focus guards, internal backdrops, hidden inputs, slider input, QR drawing) live in shadow roots around a `<slot>`.
- Both modes: the element is the part, or `as-child` (props go to the first child; host `display: contents`).
- Kebab-case `CustomEvent`s; cancelable ones call `eventDetails.cancel()` on `preventDefault()`.
- Form controls are form-associated (`ControlElement`, `ElementInternals`), submit under `name`.
- `RootContext` files must not import element classes at runtime (only `import type`): use `providesContext(ctx)`
  instead of `instanceof`, or a cycle breaks module initialisation.

## Commands

`pnpm lint:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Core and store come from the workspace (`workspace:*`)
and their built `dist/`: after changing core, build it first (`pnpm build` at the root, or `pnpm dev`). Never commit, push or publish unless asked.
