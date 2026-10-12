# @flippo-software/web-components

Headless, accessible web components built on the Flippo UI state machines (`@flippo-software/core-components`).
They render no markup and no styles of their own: you write the markup, the elements add the behaviour (ARIA,
keyboard and pointer handling, state) and expose their state as `data-*` attributes to style.

They have no dependencies besides the Flippo packages, and work in plain HTML and in any framework.

> **Status: complete, not yet released.** Every component of the core is implemented (see the catalog below).

## Install

```sh
pnpm add @flippo-software/web-components
```

## Register the elements

Tag names are `<prefix>-<part>`. You choose the prefix, so that the names never collide with another library's:

```ts
import { define } from '@flippo-software/web-components';

define({ prefix: 'ui' }); // <ui-toggle>, <ui-collapsible>, <ui-collapsible-trigger>, <ui-popover>…
define({ prefix: 'ui', components: ['collapsible'] }); // only some of them
```

Each component also has its own entry point, like in the other Flippo component packages: importing it does not pull
the other components, and its `define` registers only it (and the components it is built on, e.g. the combobox for
the autocomplete):

```ts
import { define } from '@flippo-software/web-components/dialog';
import { define as defineMenu, elements as menu } from '@flippo-software/web-components/menu';

define({ prefix: 'ui' }); // <ui-dialog>, <ui-dialog-trigger>…
defineMenu({ prefix: 'ui' });
menu.item; // the class of <ui-menu-item>
```

The entry points are the kebab-case names of the components: `accordion`, `checkbox-group`, `navigation-menu`, `qr-code`…

The element classes are also exported, grouped like the parts of the headless components, to register under any
name:

```ts
import { components } from '@flippo-software/web-components';

customElements.define('my-disclosure', class extends components.collapsible.root {});
```

## Usage

```html
<ui-collapsible>
    <ui-collapsible-trigger>Details</ui-collapsible-trigger>
    <ui-collapsible-panel>More text.</ui-collapsible-panel>
</ui-collapsible>

<ui-toggle value="bold" aria-label="Bold">B</ui-toggle>
```

```css
ui-collapsible-panel[data-closed] { /* … */ }
ui-toggle[data-pressed] { background: black; color: white; }
```

### Options: attributes and properties

Every option is both an attribute (kebab-case) and a property (camelCase). Attributes only carry strings; set arrays,
objects and functions as properties. Changes are applied together, in a microtask.

An option whose attribute is absent is not set. For controlled values this matters: `<ui-collapsible>` manages its own
open state, `<ui-collapsible open>` follows the `open` attribute or property only, and reports changes with an event.

### Events

Changes are reported with `CustomEvent`s. Calling `preventDefault()` cancels the change:

```ts
collapsible.addEventListener('open-change', (event) => {
    if (!mayOpen) {
        event.preventDefault();
    }
});
```

### `as-child`

By default, the element itself is the part (`<ui-collapsible-trigger>` gets `role="button"`, `tabindex`…). With
`as-child`, the props go to its only child element instead, e.g. a native button or a link, and the wrapper takes no
box (`display: contents`):

```html
<ui-collapsible-trigger as-child>
    <button type="button">Details</button>
</ui-collapsible-trigger>
```

The child may be replaced (e.g. by a framework): the props move to the new one.

`as-child` elements nest: the props of each go to the innermost child, which composes components like `render` does in
the React version:

```html
<ui-toolbar-button as-child><ui-toggle as-child><button type="button">B</button></ui-toggle></ui-toolbar-button>
```

### Forms

Form controls (checkbox, switch, radio group, select, slider, number field…) are form-associated custom elements: they
submit their value under their `name`, take part in the validation of their form, and are reset and disabled with it
(`<fieldset disabled>`), like native controls. A `<label for>` pointing at them works. The hidden `<input>` the
machines use is in their shadow root.

### Lists rendered for you

Toasts and the chips of a multiple combobox are a list of values. Give their container a `<template>` and it renders a
copy of it for each value (the copies are the component's own nodes); or, in a framework, render them yourself from the
values (`toasts-change` event of `<prefix>-toast-provider`, `value` of `<prefix>-combobox`).

## Catalog

| Component | Tags (`<prefix>-…`) |
| --- | --- |
| Accordion | `accordion`, `-item`, `-header`, `-trigger`, `-panel` |
| Autocomplete | `autocomplete` (with the combobox parts) |
| Avatar | `avatar`, `-image`, `-fallback` |
| Button | `button` |
| Checkbox | `checkbox`, `-indicator`; `checkbox-group` |
| Checkbox card | `checkbox-card`, `-indicator` |
| Collapsible | `collapsible`, `-trigger`, `-panel` |
| Combobox | `combobox`, `-input`, `-trigger`, `-icon`, `-clear`, `-value`, `-chips`, `-chip`, `-chip-label`, `-chip-remove`, `-backdrop`, `-positioner`, `-popup`, `-arrow`, `-list`, `-empty`, `-status`, `-item`, `-item-indicator`, `-group`, `-group-label`, `-row` |
| Context menu | `context-menu`, `-trigger` (with the menu parts) |
| Dialog | `dialog`, `-trigger`, `-backdrop`, `-popup`, `-close`, `-title`, `-description` |
| Drawer | `drawer`, `-trigger`, `-backdrop`, `-popup`, `-drag`, `-close`, `-title`, `-description` |
| Field | `field`, `-item`, `-label`, `-control`, `-description`, `-error`; `fieldset`, `-legend`; `form` |
| Marquee | `marquee`, `-track` |
| Menu | `menu`, `-trigger`, `-backdrop`, `-positioner`, `-popup`, `-arrow`, `-item`, `-link-item`, `-checkbox-item`, `-radio-group`, `-radio-item`, `-item-indicator`, `-group`, `-group-label`, `-submenu`, `-submenu-trigger`; `menubar` |
| Meter | `meter`, `-label`, `-track`, `-indicator`, `-value` |
| Navigation menu | `navigation-menu`, `-list`, `-item`, `-trigger`, `-icon`, `-content`, `-link` |
| Number field | `number-field`, `-group`, `-input`, `-increment`, `-decrement`, `-scrub-area`, `-scrub-area-cursor` |
| Pin input | `pin-input`, `-group`, `-focus-funnel`, `-pin` |
| Popover | `popover`, `-trigger`, `-positioner`, `-popup`, `-arrow`, `-close`, `-title`, `-description` |
| Progress | `progress`, `-label`, `-track`, `-indicator`, `-value` |
| QR code | `qr-code`, `-frame`, `-overlay`, `-generate-trigger`, `-download-trigger`, `-clipboard-trigger` |
| Radio | `radio-group`, `radio`, `-indicator`; `radio-card`, `-indicator` |
| Scroll area | `scroll-area`, `-viewport`, `-content`, `-scrollbar`, `-thumb`, `-corner` |
| Segmented control | `segmented-control`, `-item` |
| Select | `select`, `-trigger`, `-value`, `-icon`, `-backdrop`, `-positioner`, `-popup`, `-list`, `-arrow`, `-scroll-up-arrow`, `-scroll-down-arrow`, `-item`, `-item-text`, `-item-indicator`, `-group`, `-group-label` |
| Separator | `separator` |
| Slider | `slider`, `-value`, `-control`, `-track`, `-indicator`, `-thumb` |
| Snippet | `snippet`, `-line`, `-symbol`, `-copy-button` |
| Switch | `switch`, `-thumb` |
| Tabs | `tabs`, `-list`, `-tab`, `-indicator`, `-panel` |
| Toast | `toast-provider`, `toast-viewport`, `toast`, `-title`, `-description`, `-action`, `-close` |
| Toggle | `toggle`; `toggle-group` |
| Toolbar | `toolbar`, `-group`, `-button`, `-link`, `-input`, `-separator` |
| Tooltip | `tooltip-provider`, `tooltip`, `-trigger`, `-positioner`, `-popup`, `-arrow` |

Each element documents its attributes, properties, events and state attributes in its class (and in the typings).
The sections below show some of them.

### Differences from the React version

The elements never move the page's nodes (frameworks own them), so:

- popups are shown in the top layer (Popover API) where they are in the document, instead of in a portal;
- the content of a navigation menu item is shown, positioned against its trigger, inside its item: there is no
  shared viewport;
- values shown as text (a progress value, the label of a select value, a toast title…) are the fallback content of a
  `<slot>`: children you give replace them;
- elements the components add (focus guards, internal backdrops, the hidden inputs of form controls, the input of a
  slider thumb, the drawing of a QR code) live in shadow roots; ARIA references from them to your label are replaced by
  its text (`aria-label`);
- the marquee repeats its content in the page (copies are `aria-hidden`, inert and without ids);
- the QR code draws nothing by itself: give it a renderer (`createRenderer`), e.g. from `qr-code-styling`.

## Components

### Toggle

| | |
| --- | --- |
| Tag | `<prefix>-toggle` |
| Attributes | `pressed` (controlled), `default-pressed`, `disabled`, `value` |
| Events | `pressed-change` — `detail: { pressed, reason }` |
| State attributes | `data-pressed`, `data-disabled` |

### Collapsible

| Part | Attributes | State attributes |
| --- | --- | --- |
| `<prefix>-collapsible` | `open` (controlled), `default-open`, `disabled` | `data-open` / `data-closed`, `data-disabled`, transition attributes |
| `<prefix>-collapsible-trigger` | `disabled` (defaults to the root's) | `data-panel-open`, `data-disabled` |
| `<prefix>-collapsible-panel` | `hidden-until-found`, `keep-mounted` | `data-open` / `data-closed`, transition attributes |

Events: `open-change` on the root — `detail: { open, reason }`. The panel gets the CSS variables
`--collapsible-panel-height` and `--collapsible-panel-width` for size animations, and an `id` (yours, if it has one)
referenced by the trigger's `aria-controls`.

The markup belongs to the page: where the React components unmount a closed panel, the element is `hidden` instead.

### Popover

```html
<ui-popover>
    <ui-popover-trigger as-child><button type="button">Notifications</button></ui-popover-trigger>
    <ui-popover-positioner side="bottom" side-offset="8">
        <ui-popover-popup>
            <ui-popover-arrow></ui-popover-arrow>
            <ui-popover-title>Notifications</ui-popover-title>
            <ui-popover-description>You are all caught up.</ui-popover-description>
            <ui-popover-close>Close</ui-popover-close>
        </ui-popover-popup>
    </ui-popover-positioner>
</ui-popover>
```

| Part | Attributes | State attributes |
| --- | --- | --- |
| `<prefix>-popover` | `open` (controlled), `default-open`, `modal` | — |
| `<prefix>-popover-trigger` | `disabled`, `open-on-hover`, `delay`, `close-delay` | `data-popup-open` (`data-pressed` when opened by a press), `data-disabled` |
| `<prefix>-popover-positioner` | `side`, `align`, `side-offset`, `align-offset`, `collision-padding`, `arrow-padding`, `sticky`, `position-method` (`fixed` by default), `keep-mounted`, `disable-anchor-tracking` | `data-open` / `data-closed`, `data-side`, `data-align`, `data-anchor-hidden` |
| `<prefix>-popover-popup` | — | `data-open` / `data-closed`, `data-side`, `data-align`, transition attributes |
| `<prefix>-popover-arrow` | — | `data-side`, `data-align`, `data-uncentered` |
| `<prefix>-popover-close` | `disabled` | — |
| `<prefix>-popover-title`, `<prefix>-popover-description` | — (their `id` labels the popup) | — |

Events on the root: `open-change` (cancelable) — `detail: { open, reason }`; `open-change-complete` — `detail: { open }`.
The popup is a `dialog` labelled by the title and described by the description; it closes on Escape, on a press
outside and with the close button.

**No portal: the top layer.** The positioner is shown in the
[top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer) with the Popover API (`popover="manual"`),
so it is above everything, whatever the `overflow` and `z-index` of its ancestors, while staying where it is in the
document. A small stylesheet undoes the browser styles of `[popover]`; it lives in the `flippo-top-layer` cascade
layer, so any style of the page wins over it (declare `@layer flippo-top-layer` first if you use layers yourself). Since the popup stays in
place, put it after the trigger: Tab moves from the trigger into the popup in document order.

**Modal.** With `modal`, the rest of the page is inert and does not scroll, and an internal backdrop below the popup
catches presses outside (they close the popover instead of reaching the page). With `modal="trap-focus"`, only the focus
is trapped: Tab cycles inside the popup, the page stays usable.

The few elements the components add — the focus guards around the popup and the internal backdrop — live in **shadow
roots** of the positioner and of the root, around a `<slot>`: your markup stays in the light DOM, untouched, so
frameworks keep owning it and your CSS styles it as usual.

**Nested.** A popover inside the popup of another one is its child: pressing inside the child does not close the parent,
Escape closes the child first, and a press outside both closes both.

Not yet: the backdrop and viewport parts of the React version.

### Dialog

```html
<ui-dialog>
    <ui-dialog-trigger as-child><button type="button">Settings</button></ui-dialog-trigger>
    <ui-dialog-backdrop class="backdrop"></ui-dialog-backdrop>
    <ui-dialog-popup class="dialog">
        <ui-dialog-title>Settings</ui-dialog-title>
        <ui-dialog-description>Changes are saved automatically.</ui-dialog-description>
        <ui-dialog-close as-child><button type="button">Done</button></ui-dialog-close>
    </ui-dialog-popup>
</ui-dialog>
```

| Part | Attributes | State attributes |
| --- | --- | --- |
| `<prefix>-dialog` | `open` (controlled), `default-open`, `modal` (`"false"`, `"trap-focus"`), `disable-pointer-dismissal` | — |
| `<prefix>-dialog-trigger` | `disabled` | `data-popup-open`, `data-disabled` |
| `<prefix>-dialog-backdrop` | `force-render` | `data-open` / `data-closed`, transition attributes |
| `<prefix>-dialog-popup` | — | `data-open` / `data-closed`, `data-nested`, `data-nested-dialog-open`, transition attributes |
| `<prefix>-dialog-close` | `disabled` | — |
| `<prefix>-dialog-title`, `<prefix>-dialog-description` | — (their `id` labels the popup) | — |

Events on the root: `open-change` (cancelable) and `open-change-complete`, like the popover.

A dialog is **modal by default**: the page is inert and does not scroll, the focus is trapped in the popup (the focus
guards are in the shadow root of the root, around a `<slot>`), and a press outside closes it (unless
`disable-pointer-dismissal`). `modal="trap-focus"` only traps the focus; `modal="false"` leaves the page usable.

The popup and the backdrop are shown in the top layer, the backdrop below the popup. The popup keeps the browser's
centering of popovers; style the backdrop to cover the viewport (`position: fixed; inset: 0`). A dialog inside the popup
of another one is nested: only the topmost closes on Escape, the parent popup gets `data-nested-dialog-open`, and the
nested dialog has no backdrop of its own unless it has `force-render`.

### Tooltip

```html
<ui-tooltip-provider delay="300">
    <ui-tooltip>
        <ui-tooltip-trigger as-child><button type="button">Save</button></ui-tooltip-trigger>
        <ui-tooltip-positioner side-offset="6">
            <ui-tooltip-popup class="tooltip">
                Saves the document
                <ui-tooltip-arrow class="arrow"></ui-tooltip-arrow>
            </ui-tooltip-popup>
        </ui-tooltip-positioner>
    </ui-tooltip>
</ui-tooltip-provider>
```

| Part | Attributes | State attributes |
| --- | --- | --- |
| `<prefix>-tooltip-provider` | `delay`, `close-delay`, `timeout` (ms; 400 by default) | — |
| `<prefix>-tooltip` | `open` (controlled), `default-open`, `disabled`, `disable-hoverable-popup`, `track-cursor-axis` (`none`, `x`, `y`, `both`) | — |
| `<prefix>-tooltip-trigger` | `delay`, `close-delay`, `disabled`, `primary` | `data-popup-open` |
| `<prefix>-tooltip-positioner` | like the popover positioner (`side` defaults to `top`) | `data-open` / `data-closed`, `data-side`, `data-align`, `data-anchor-hidden` |
| `<prefix>-tooltip-popup` | — | `data-open` / `data-closed`, `data-side`, `data-align`, `data-instant`, transition attributes |
| `<prefix>-tooltip-arrow` | — | `data-open` / `data-closed`, `data-side`, `data-align`, `data-uncentered` |

Events on the root: `open-change` (cancelable) and `open-change-complete`.

The tooltip opens on hover and on focus and closes on Escape. The provider is optional: the tooltips inside it share
its delays, and once one is open, moving to another opens it instantly (within `timeout`). The positioner is shown in
the top layer while the tooltip is mounted.

### Menu

```html
<ui-menu>
    <ui-menu-trigger as-child><button type="button">Edit</button></ui-menu-trigger>
    <ui-menu-positioner side-offset="4">
        <ui-menu-popup class="menu">
            <ui-menu-item>Copy</ui-menu-item>
            <ui-menu-item disabled>Paste</ui-menu-item>
            <ui-menu-checkbox-item>
                <ui-menu-item-indicator>✓</ui-menu-item-indicator>Word wrap
            </ui-menu-checkbox-item>
            <ui-menu-group>
                <ui-menu-group-label>Sort by</ui-menu-group-label>
                <ui-menu-radio-group default-value="name">
                    <ui-menu-radio-item value="name"><ui-menu-item-indicator>•</ui-menu-item-indicator>Name</ui-menu-radio-item>
                    <ui-menu-radio-item value="date"><ui-menu-item-indicator>•</ui-menu-item-indicator>Date</ui-menu-radio-item>
                </ui-menu-radio-group>
            </ui-menu-group>
            <ui-menu-submenu>
                <ui-menu-submenu-trigger>Share</ui-menu-submenu-trigger>
                <ui-menu-positioner>
                    <ui-menu-popup class="menu">
                        <ui-menu-item>Email</ui-menu-item>
                        <ui-menu-link-item as-child><a href="/share">Copy link</a></ui-menu-link-item>
                    </ui-menu-popup>
                </ui-menu-positioner>
            </ui-menu-submenu>
        </ui-menu-popup>
    </ui-menu-positioner>
</ui-menu>
```

| Part | Attributes | State attributes |
| --- | --- | --- |
| `<prefix>-menu` | `open` (controlled), `default-open`, `disabled`, `modal` (`"false"`), `loop-focus` (`"false"`), `orientation`, `highlight-item-on-hover` (`"false"`) | — |
| `<prefix>-menu-trigger` | `disabled`, `open-on-hover`, `delay`, `close-delay` | `data-popup-open`, `data-pressed`, `data-disabled` |
| `<prefix>-menu-backdrop` | — | `data-open` / `data-closed`, transition attributes |
| `<prefix>-menu-positioner` | like the popover positioner (`collision-padding` 5 by default) | `data-open` / `data-closed`, `data-side`, `data-align`, `data-anchor-hidden`, `data-nested` |
| `<prefix>-menu-popup` | — | `data-open` / `data-closed`, `data-side`, `data-align`, `data-nested`, `data-instant`, transition attributes |
| `<prefix>-menu-arrow` | — | `data-open` / `data-closed`, `data-side`, `data-align`, `data-uncentered` |
| `<prefix>-menu-item` | `label`, `disabled`, `close-on-click` (`"false"`) | `data-highlighted`, `data-disabled` |
| `<prefix>-menu-link-item` | `label`, `close-on-click` | `data-highlighted` |
| `<prefix>-menu-checkbox-item` | `label`, `disabled`, `checked` (controlled), `default-checked`, `close-on-click` | `data-checked` / `data-unchecked`, `data-highlighted`, `data-disabled` |
| `<prefix>-menu-radio-group` | `value` (controlled), `default-value`, `disabled` | `data-disabled` |
| `<prefix>-menu-radio-item` | `value`, `label`, `disabled`, `close-on-click` | `data-checked` / `data-unchecked`, `data-highlighted`, `data-disabled` |
| `<prefix>-menu-item-indicator` | `keep-mounted` | `data-checked` / `data-unchecked`, transition attributes |
| `<prefix>-menu-group`, `<prefix>-menu-group-label` | — (the label's `id` labels the group) | — |
| `<prefix>-menu-submenu` | like the menu (`close-parent-on-esc` instead of `modal`) | — |
| `<prefix>-menu-submenu-trigger` | `label`, `disabled`, `open-on-hover` (`"false"`), `delay`, `close-delay` | `data-popup-open`, `data-highlighted`, `data-disabled` |

Events: `open-change` (cancelable) and `open-change-complete` on the menu and on submenus, `checked-change`
(cancelable; `detail: { checked, reason }`) on checkbox items, `value-change` (cancelable; `detail: { value, reason }`)
on radio groups. Listen to `click` on an item to run its action.

The menu is **modal by default**: the page does not scroll and a press outside only closes the menu (`modal="false"`
leaves the page usable). The arrow keys move between items, typing jumps to the item whose text starts with it, and
Escape closes the menu and gives the focus back to the trigger. A submenu goes in the popup of its menu, its trigger
first: it opens on hover or with the arrow key towards it.

## In frameworks

The elements are plain DOM elements; frameworks only differ in how they pass properties and listen to events.

**React 19** sets properties and listens to custom events with `on` + the event name:

```tsx
<ui-toggle pressed={pressed} onpressed-change={(event) => setPressed(event.detail.pressed)}>B</ui-toggle>
```

React 18 only sets string attributes and does not listen to custom events: use a `ref`. In React apps, the headless
components (`@flippo-software/react-components`) are the native choice; the web components are for mixed stacks.

**Vue 3** sets properties when the element has them, and listens with `@`:

```vue
<ui-toggle :pressed="pressed" @pressed-change="pressed = $event.detail.pressed">B</ui-toggle>
```

Tell the template compiler which tags are custom elements:

```ts
// vite.config.ts
vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('ui-') } } });
```

**Other frameworks** (Svelte, Angular, Solid…) work the same way: bind properties for non-string values, listen to the
kebab-case events.

Notes:

- The elements set ARIA, `data-*`, `role`, `tabindex` and `hidden` on their target: do not set them from the framework
  as well.
- Register the elements after hydration when rendering on the server, so that the attributes they add do not differ
  from the server markup during hydration.
- The elements never move nodes in the document (which would break frameworks); popups will use the top layer
  (Popover API) instead of portals.

## How it works

Each element creates the state machines of `@flippo-software/core-components` and connects them while it is in the
document. The machines keep their options and state in stores of `@flippo-software/store`, so an `effect` applies
their props to the target element: it re-runs only when a value it read changes (an option, a state key), and applies
only the difference — there is no virtual DOM. Compound components find their root
with the [Context Community Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md),
also when the root is defined after its parts.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm build` | Build ESM, CJS and declarations with tsdown |
| `pnpm test` | Run the tests (DOM, React 19 and Vue 3) |
| `pnpm typecheck` | Type-check with TypeScript |
| `pnpm lint:check` | Lint and check formatting with Biome |
