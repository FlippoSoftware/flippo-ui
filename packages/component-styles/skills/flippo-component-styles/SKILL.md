---
name: flippo-component-styles
description: Use when styling UI with @flippo-software/component-styles — the Flippo design tokens, reset, light/dark themes, component CSS and class recipes (button(), select(), dialog()…) for plain HTML, the Flippo web components or headless React components. Explains which CSS to import, how recipes return classes, data-* states, overriding with --fl-* variables, themes and the SCSS mixins.
---

# Using @flippo-software/component-styles

Full docs: `node_modules/@flippo-software/component-styles/README.md`.

## Import the CSS

- Everything: `import '@flippo-software/component-styles/css/index.css'`.
- Or: `css/fonts.css` + `css/base.css` (tokens, reset, shared classes — required) + `css/components/<name>.css`.
  Some recipes use another component's classes (dialog/popover/toast/snippet → button; drawer → dialog;
  toolbar → button, link, input): import those stylesheets too.

## Get the classes from recipes

```ts
import { button } from '@flippo-software/component-styles/button';
import { menu } from '@flippo-software/component-styles/menu';

<button class={button({ variant: 'primary', size: 'large' })}>Создать набор</button>

const m = menu();
<div class={m.popup}><div class={m.item}>Rename</div><div class={menu({ tone: 'destructive' }).item}>Delete</div></div>
```

- One-element components (`button`, `toggle`, `link`, `separator`, groups) return a string; compound components
  return an object with a class per part (`select().trigger`, `.popup`, `.item`, `.itemIndicator`…).
- Never pass `className` to change a class the recipe sets; override with variables (below).
- Text styles are classes too: `fl-text-<display-1…label>-<weaker|default|stronger>`.

## States are data attributes

Put the class on the element that the core machine / web component / headless part renders: its `data-*`
attributes (`data-checked`, `data-highlighted`, `data-popup-open`, `data-disabled`, `data-invalid`,
`data-starting-style`…) drive the states. In plain HTML set them yourself.

## Override with variables

`--fl-<component>-<prop>` (and `-hover`, `-active`, `-disabled`…) override one property; on components built on a
shared pattern it wins over the pattern's hook (`--fl-tooltip-bg` over `--fl-popup-bg`, `--fl-pin-input-height` over
`--fl-control-height`); tokens
(`--fl-color-*`, `--fl-spacing-*`, `--fl-radius-*`, `--fl-text-*`) restyle everything. Never set `--_fl-*`.

```css
.danger-zone { --fl-button-bg: var(--fl-color-error); }
```

## Themes

The page follows the system theme. `data-theme="dark"` or `"light"` on any element fixes its subtree.

## SCSS

`@use '@flippo-software/component-styles/scss' as fl;` then `@include fl.text('body', 'stronger')`,
`fl.focus-ring`, `fl.popup`, `fl.control`, `fl.item`, `fl.check`, state selectors `fl.hover { … }`,
`fl.checked { … }`, `fl.disabled { … }`, token maps `fl.$semantic`, `fl.$spacing`.
