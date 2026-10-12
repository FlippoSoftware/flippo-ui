---
name: flippo-web-components
description: Use when building UI with @flippo-software/web-components — headless accessible custom elements (dialog, popover, menu, select, combobox, tabs, accordion, checkbox, field, form, slider, toast, tooltip…) for plain HTML, React, Vue or any framework. Explains define/prefix, tags and parts, attributes vs properties, events, as-child, styling with data attributes, forms and top-layer popups.
---

# Using @flippo-software/web-components

Custom elements with the behaviour of the Flippo UI / Base UI components. They render no markup and no styles: you
write the markup and CSS, the elements add ARIA, keyboard/pointer handling and state (`data-*` attributes).
Full docs and the tag catalog: `node_modules/@flippo-software/web-components/README.md`.

## Register once

```ts
import { define } from '@flippo-software/web-components';
define({ prefix: 'ui' });                      // all components: <ui-dialog>, <ui-dialog-trigger>…

import { define as defineMenu } from '@flippo-software/web-components/menu';
defineMenu({ prefix: 'ui' });                  // only one component (smaller bundle)
```

Tags are `<prefix>-<component>` for the root and `<prefix>-<component>-<part>` for parts (kebab-case):
`ui-select-item-indicator`, `ui-navigation-menu-content`. Classes: `components.select.itemIndicator`.

## Markup

```html
<ui-dialog>
    <ui-dialog-trigger as-child><button type="button">Settings</button></ui-dialog-trigger>
    <ui-dialog-backdrop class="backdrop"></ui-dialog-backdrop>
    <ui-dialog-popup class="dialog">
        <ui-dialog-title>Settings</ui-dialog-title>
        <ui-dialog-close as-child><button type="button">Done</button></ui-dialog-close>
    </ui-dialog-popup>
</ui-dialog>
```

- The element is the part, or with `as-child` its first child is (a native `<button>`, `<a>`, `<input>`). `as-child`
  nests: `<ui-toolbar-button as-child><ui-toggle as-child><button>`.
- Popups (popover, dialog, menu, select, combobox, tooltip, drawer…) are shown in the top layer where they are in the
  document — no portal. Positioners place themselves next to their anchor; dialogs are centered by the browser
  unless styled; style backdrops to cover the viewport (`position: fixed; inset: 0`).

## Options and events

- Every option is an attribute (kebab-case) and a property (camelCase); arrays, objects and functions only as
  properties (`select.items = …`, `field.validate = fn`). `"false"` turns a boolean off.
- Absent attribute = uncontrolled. Setting `open` / `value` / `checked` makes it controlled: listen to the change
  event and set it back.
- Events are `CustomEvent`s in kebab-case: `open-change`, `value-change`, `checked-change`, `pressed-change`,
  `input-value-change`… with `detail` (`{ open, reason }`, `{ value, reason }`). `preventDefault()` cancels the change.
- React 19: `<ui-toggle pressed={pressed} onpressed-change={(e) => setPressed(e.detail.pressed)}>`; React 18 needs a
  `ref`. Vue 3: `:pressed` / `@pressed-change`, and `isCustomElement: (tag) => tag.startsWith('ui-')`.
- Do not set ARIA, `data-*`, `role`, `tabindex` or `hidden` on the target yourself; with SSR, call `define` after
  hydration.

## Styling

State attributes on the elements: `[data-open]`/`[data-closed]`, `[data-highlighted]`, `[data-selected]`,
`[data-checked]`, `[data-disabled]`, `[data-side]`, `[data-orientation]`, transition `[data-starting-style]` /
`[data-ending-style]`, plus CSS variables (`--accordion-panel-height`, `--active-tab-width`, …).

## Forms

Controls (checkbox, switch, radio-group, select, combobox, slider, number-field, pin-input, segmented-control…) are
form-associated: they submit under `name`, validate with `required`, reset and disable with their `<form>` /
`<fieldset>`. Use `ui-field` (`-label`, `-control as-child` on an `<input>`, `-description`, `-error`) and `ui-form`
(`as-child` on a `<form>`, `form-submit` event with the values).

## Lists rendered for you

Toasts (`ui-toast-viewport`) and combobox chips (`ui-combobox-chips`) render a copy of a child `<template>` per
value; frameworks can instead render the elements themselves (`toasts-change`, the combobox `value`).
