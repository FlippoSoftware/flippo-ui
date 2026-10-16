# @flippo-software/react-components

Unstyled, accessible React components with the API of [Base UI](https://base-ui.com): if you know Base UI, the
parts, props, data attributes and CSS variables are the same. They render no styles of their own: you style the
parts, the components add the behaviour (ARIA, keyboard and pointer handling, focus management, positioning, state).

Every component is a thin React adapter over the state machines of
[`@flippo-software/core-components`](../core-components), shared with
[`@flippo-software/web-components`](../web-components): the same component behaves the same in React and as a custom
element. For components with the Flippo look, use [`@flippo-software/ui-kit-react`](../ui-kit-react), built on this
package.

> **Status: not yet released.** Formerly `@flippo-ui/headless-components`.

## Install

```sh
pnpm add @flippo-software/react-components
```

React 19 (`react`, `react-dom`) is a peer dependency.

## Import

```tsx
import { Dialog, Popover, Menu, Select, Tabs } from '@flippo-software/react-components';

// Or one component per entry point: importing it does not pull the others.
import { Dialog } from '@flippo-software/react-components/dialog';
```

The entry points are the kebab-case names of the components: `accordion`, `checkbox-group`, `navigation-menu`,
`qr-code`… The package is `sideEffects: false`.

## Components

Accordion, Autocomplete, Avatar, Button, Checkbox, CheckboxCard, CheckboxGroup, Collapsible, Combobox, ContextMenu,
Dialog, Drawer, Field, Fieldset, Form, Input, List, Marquee, Menu, Menubar, Meter, NavigationMenu, NumberField,
PinInput, Popover, Progress, QrCode, Radio, RadioCard, RadioGroup, ScrollArea, SegmentedControl, Select, Separator,
Slider, Snippet, Switch, Tabs, Textarea, Toast, Toggle, ToggleGroup, Toolbar, Tooltip.

Utilities: `DirectionProvider` (right-to-left layouts), `CSPProvider` (nonce of inline `<style>` elements, or none at all),
`LabelableProvider`, `NoSsr`, `Slot`, `useRender` (the `render` prop for your own components), `useButton`,
`mergeProps`.

## Usage

A component is a namespace of parts, composed as markup:

```tsx
<Dialog.Root>
    <Dialog.Trigger className="button">Settings</Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Backdrop className="backdrop" />
        <Dialog.Popup className="popup">
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>Changes apply at once.</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
    </Dialog.Portal>
</Dialog.Root>
```

Popups render through `X.Portal`; positioned popups (popover, menu, select, tooltip…) go in `X.Positioner`, which
takes `side`, `align`, `sideOffset`, `collisionPadding` and the like.

### Style the parts

Every part takes `className` and `style`, as values or as functions of its state, and exposes the state as data
attributes and CSS variables:

```tsx
<Dialog.Popup className={(state) => (state.open ? 'popup open' : 'popup')} />
```

```css
.popup[data-starting-style],
.popup[data-ending-style] {
    opacity: 0;
}
.positioner {
    max-height: var(--available-height);
}
```

Common attributes: `data-open` / `data-closed`, `data-starting-style` / `data-ending-style` (enter and exit
transitions), `data-highlighted`, `data-selected`, `data-checked`, `data-pressed`, `data-disabled`, `data-invalid`,
`data-side`, `data-align`, `data-orientation`. Common CSS variables: `--anchor-width`, `--available-height`,
`--transform-origin`, `--accordion-panel-height`, `--collapsible-panel-height`.

### Replace the element: `render`

`render` renders a part as another element or component, keeping its props and behaviour:

```tsx
<Menu.Trigger render={<button className="icon-button" />} />
<Tooltip.Trigger render={<Dialog.Trigger />}>Open</Tooltip.Trigger>
<Tabs.Tab render={(props, state) => <a {...props} href="#tab" />} />
```

### State and events

- Uncontrolled: `defaultOpen`, `defaultValue`, `defaultChecked`. Controlled: `open` + `onOpenChange`, `value` +
  `onValueChange`, `checked` + `onCheckedChange`.
- Change callbacks receive `(value, eventDetails)`: `eventDetails.reason` (`'trigger-press'`, `'outside-press'`,
  `'escape-key'`, `'item-press'`…), the native `eventDetails.event`, and `eventDetails.cancel()` to refuse the change.

### Forms

Wrap controls in `Field.Root` (`Field.Label`, `Field.Description`, `Field.Error`, `Field.Control`) and the fields in
`Form`. Controls submit under their `name`; `Form` reports `onFormSubmit(values)` and shows server `errors` on the
matching fields. Validation runs on submit by default (`validationMode`: `onBlur`, `onChange`).

```tsx
<Form onFormSubmit={save}>
    <Field.Root name="title">
        <Field.Label>Title</Field.Label>
        <Field.Control required />
        <Field.Error match="valueMissing">Enter a title</Field.Error>
    </Field.Root>
    <button type="submit">Save</button>
</Form>
```

## Server rendering

The components render on the server; behaviour attaches on hydration. Two of them add inline elements:
`ScrollArea` an inline `<style>` (give it a nonce, or turn it off, with `CSPProvider`), and `Tabs.Indicator` a small
inline `<script>` that positions the indicator before hydration (it does not take a nonce yet).

## Development

This package is part of the [`flippo-ui`](../../README.md) pnpm workspace: run the commands from the root
(`pnpm check`, or `pnpm --filter @flippo-software/react-components <script>`).

- Behaviour belongs in [`core-components`](../core-components): change the machine there, then the adapter here. This
  package uses core's built `dist/` — rebuild it (`pnpm build`, or keep `pnpm dev` running at the root).
- `src/components/<Name>/` holds one folder per part (`root/`, `trigger/`, `popup/`…) and the tests of the component;
  `src/lib/` holds the adapter layer (`useMachine`, `useMachineState`, `useTracker`, `useRenderElement`…). Imports
  between areas use the `~@lib/*` and `~@packages/*` aliases.
- Tests run every component in default and `StrictMode` renders (`RENDER_MODES`), with
  [`@flippo-software/internal-test-utils`](../internal-test-utils).
- [`AGENTS.md`](./AGENTS.md) describes the adapter pattern in detail.
