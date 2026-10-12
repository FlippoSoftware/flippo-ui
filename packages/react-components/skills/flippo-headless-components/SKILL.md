---
name: flippo-headless-components
description: Use when building React UI with @flippo-software/react-components — unstyled accessible components with the Base UI API (Dialog, Popover, Menu, Select, Combobox, Tabs, Accordion, Checkbox, Field, Form, Slider, Toast, Tooltip…). Explains imports, parts, render/className props, state data attributes, controlled props and change events.
---

# Using @flippo-software/react-components

Unstyled React components with the API of Base UI (`@base-ui-components/react`): if you know Base UI, the parts,
props and data attributes are the same. Behaviour comes from `@flippo-software/core-components` state machines.

## Import

```tsx
import { Dialog, Popover, Menu, Select, Tabs } from '@flippo-software/react-components';
// or per component (smaller bundles):
import { Dialog } from '@flippo-software/react-components/dialog';
```

Components: Accordion, Autocomplete, Avatar, Button, Checkbox, CheckboxCard, CheckboxGroup, Collapsible, Combobox,
ContextMenu, Dialog, Drawer, Field, Fieldset, Form, Input, Marquee, Menu, Menubar, Meter, NavigationMenu, NumberField,
PinInput, Popover, Progress, QrCode, Radio, RadioCard, RadioGroup, ScrollArea, SegmentedControl, Select, Separator,
Slider, Snippet, Switch, Tabs, Textarea, Toast, Toggle, ToggleGroup, Toolbar, Tooltip.

## Compose the parts

```tsx
<Dialog.Root>
    <Dialog.Trigger className="btn">Open</Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Backdrop className="backdrop" />
        <Dialog.Popup className={(state) => (state.open ? 'popup open' : 'popup')}>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>…</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
    </Dialog.Portal>
</Dialog.Root>
```

- Popups render through `X.Portal`; positioned popups use `X.Positioner` (`side`, `align`, `sideOffset`, …).
- `render` replaces the element: `<Menu.Trigger render={<button className="icon" />} />` or a function
  `(props, state) => <a {...props} />`. Compose components the same way
  (`<Tooltip.Trigger render={<Dialog.Trigger />} />`).
- `className` and `style` may be functions of the part's state.

## Style with data attributes

Parts expose their state as attributes: `[data-open]`/`[data-closed]`, `[data-starting-style]`/`[data-ending-style]`
(transitions), `[data-highlighted]`, `[data-selected]`, `[data-checked]`, `[data-disabled]`, `[data-side]`,
`[data-align]`, `[data-orientation]`…, and CSS variables (`--anchor-width`, `--available-height`,
`--accordion-panel-height`, …).

## State and events

- Uncontrolled: `defaultOpen`, `defaultValue`, `defaultChecked`. Controlled: `open` + `onOpenChange`, `value` +
  `onValueChange`, `checked` + `onCheckedChange`.
- Callbacks get `(value, eventDetails)`: `eventDetails.reason` (`'trigger-press'`, `'outside-press'`,
  `'escape-key'`, …), `eventDetails.event`, and `eventDetails.cancel()` to refuse the change.
- Forms: wrap controls in `Field.Root` (`Field.Label`, `Field.Description`, `Field.Error`, `Field.Control`) and
  `Form` (`onFormSubmit(values)`, server `errors`); controls submit under `name`.
