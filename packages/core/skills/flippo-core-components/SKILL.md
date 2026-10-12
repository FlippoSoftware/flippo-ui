---
name: flippo-core-components
description: Use when building UI on @flippo-software/core-components directly — writing a framework adapter or vanilla code that drives its state machines (Dialog, Popover, Menu, Select, Tabs, Checkbox… ). Explains the entry points, the machine lifecycle and the adapter rules.
---

# Using @flippo-software/core-components

Framework-agnostic state machines of the Flippo UI components (Base UI behaviour). Ready-made renderings exist:
React — `@flippo-ui/headless-components`; custom elements — `@flippo-software/web-components`. Use the machines
directly only to write another adapter or a bespoke component. The README in the package lists every entry point.

## Imports

Each component and lib area is its own entry point (tree-shakable, `sideEffects: false`):

```ts
import { DialogRootMachine, DialogTriggerMachine, DialogPopupMachine } from '@flippo-software/core-components/dialog';
import { mergeProps } from '@flippo-software/core-components/props';
import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { createChangeEventDetails, REASONS } from '@flippo-software/core-components/events';
import { batch, effect } from '@flippo-software/core-components/store'; // re-export of @flippo-software/store
```

Areas: `store`, `events`, `timers`, `dom`, `props`, `attributes`, `patterns`, `lib`, `floating` (FocusManager,
interactions, FloatingTreeStore), `positioning` (AnchorPositioner), `popup` (popup controllers). Components: accordion,
autocomplete, avatar, button, checkbox(-card/-group), collapsible, combobox, composite, context-menu, dialog, drawer,
field, fieldset, form, labelable, list, marquee, menu, menubar, meter, navigation-menu, number-field, pin-input,
popover, progress, qr-code, radio(-card/-group), scroll-area, segmented-control, select, separator, slider, snippet,
switch, tabs, toast, toggle(-group), toolbar, tooltip.

## Machine lifecycle

1. Create once per component instance: `new XMachine(options, setup)` — no side effects. Parts take their root
   (`new DialogTriggerMachine(root.store, options)`, `new SelectItemMachine(root, positioner.items, options)`).
2. Every render / option change: `setOptions(options)`. In a framework render, wrap it in
   `deferNotifications(() => …)` and call `flushNotifications()` after the commit; elsewhere wrap batches of changes in
   `batch`.
3. After each commit: `afterCommit?.()` (side effects of option changes).
4. On mount: `const disconnect = machine.connect()`; on unmount `disconnect()`. Connecting again is allowed.
5. Pass DOM elements with the setters (`setElement`, `setTrigger…`), apply `machine.getXProps()` to the element
   (React-shaped props: map `onFocus`→`focusin`, `onBlur`→`focusout`, `onChange`→`input`, `className`, style objects),
   and `XMachine.attrs(machine.getState())` as data attributes.
6. Re-render when what you read changes: wrap reads in a store `effect`, or track them with `ReadTracker`
   (`new ReadTracker({ ignore: isOptionsStore })` — options change on every render).

## Rules

- Machines never call user callbacks from `setOptions`; user callbacks receive `eventDetails` with `reason` and
  `cancel()`.
- Controlled values: pass `open`/`value`/`checked`; local changes of a controlled key are ignored.
- Portals are yours: popup machines take `portal: null` when rendered in place (e.g. top layer).
- Install one copy of `@flippo-software/store` (the notification queue is shared).
