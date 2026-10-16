---
name: web-component
description: Use when adding or changing a custom element in @flippo-software/web-components — wiring a core machine into a MachineElement/ContextPart, contexts between parts, as-child, top layer popups, shadow-DOM internals, form-associated controls, registration (elements/define/entry points) and tests with happy-dom.
---

# Adding or changing a web component

## 1. Map the parts

Read the core machines (`../core-components/src/components/<name>/`) and the React adapter
(`../react-components/src/components/<Name>/`): the React part is the wiring reference (which machine, which setup,
which props getter, which element setter). Pick a sibling to copy: simple `toggle/`, compound `collapsible/`, popup
`popover/` or `dialog/`, list `menu/` or `select/`, form control `checkbox/` or `switch/`.

## 2. Files

```
src/components/<name>/root/<Name>Element.ts        root: MachineElement.withAttributes({...}); declareProvider + provideContext
src/components/<name>/root/<Name>RootContext.ts    createContext<Type>() (import type only), <NAME>_ROOT tuples, part bases, detail types
src/components/<name>/<part>/<Name><Part>Element.ts
src/components/<name>/index.ts                      export *, `elements`, `define`
```

## 3. Element skeleton

```ts
export class FooTriggerElement extends FooPart.withAttributes({ disabled: 'boolean', delay: 'number' }) {
    private trigger!: FooTriggerMachine;
    private readonly generatedId = createId('foo-trigger');

    protected override createParts() { this.trigger = new FooTriggerMachine(this.root.store, this.getOptions()); }
    protected override applyOptions() { this.trigger.setOptions(this.getOptions()); }
    protected override afterOptions() { this.trigger.afterCommit(); }          // if the machine has it
    protected override connectParts() { return this.trigger.connect(); }       // return the cleanup
    protected override onTargetChange(element: HTMLElement | null) { this.trigger?.setElement(element); }
    protected override getProps(): Props {
        return mergeProps(this.trigger.getTriggerProps(), FooTriggerMachine.attrs(this.trigger.getState()));
    }
    private getOptions() {
        return { id: this.targetId(this.generatedId), disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
```

- Attributes: `'boolean' | 'string' | 'number' | ['a', 'b']`; non-string options with `property<T>()`.
  `"false"` turns a boolean off; absent = `undefined` (controlled options stay uncontrolled).
- Options read only attributes/properties; values from elsewhere → `this.invalidateOptions()`.
- `getProps` runs in an effect: everything it reads is tracked. Writes inside effects go through `untracked`.
- Callbacks → `this.emit('kebab-name', detail, eventDetails)`.
- Parts: `abstract class FooPart extends ContextPart<typeof FOO_ROOT> { protected readonly contexts = FOO_ROOT; }`.
  Optional parents: `requestAncestorContext(this, Ctx, providesContext(Ctx), cb)` in `whenReady`; cancel on disconnect.
- Popups: `prepareTopLayer` / `showInTopLayerInOrder` from an effect on `mounted`; machines get `portal: null`; focus
  guards in a shadow root (`FocusGuards`); internal backdrop in the root's shadow root.
- Text shown by the element (a value, a label): `FallbackText` (slot fallback, page children win).
- Form controls: extend `ControlElement` (field/labelable/field item contexts, `FormControl` hidden input +
  `ElementInternals`, `toFormValue`, `resetValue`); pass the same id as `id`/`defaultId` so labels target the host.
- Never move page nodes; never import element classes at runtime from `RootContext`.

## 4. Register

`index.ts`: `export const elements = { root: FooElement, trigger: FooTriggerElement, … } as const;` and
`export function define(options) { registerElements('foo', elements, options); }` (call the `define` of components it
builds on first). Add the component to `src/define.ts` (`components`), its files to `src/index.ts`, its folder to
`COMPONENTS` in `tsdown.config.ts`, and a row + section in `README.md`.

## 5. Test and check

`test/<name>.test.ts` with `define({ prefix: 'ui' })`, mount markup, `await tick()`; use `stubPopoverApi()` for top
layer, `stubElementInternals()` for form values. Cover attributes → ARIA/data attributes, events (+ cancel), keyboard,
as-child. Then: `pnpm lint:check && pnpm typecheck && pnpm test && pnpm build`.
