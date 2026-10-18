# @flippo-software/component-styles

Design tokens, a reset, light and dark themes and the styles of every Flippo component, with class recipes
([`@lynstack/class-recipe`](https://lynstack.github.io/recipe/class-recipe/)) that return the classes of each part.
The styled packages built on `@flippo-software/web-components` and `@flippo-software/react-components` use it; you can
use it directly with plain HTML or any framework.

The design comes from the Figma file "Flippo" (Components & Foundations). Components that are not drawn there
(checkbox, radio, switch, select, dialog, slider…) are built from the same tokens and patterns.

## Install

```sh
pnpm add @flippo-software/component-styles
```

## Use

Import everything once:

```ts
import '@flippo-software/component-styles/css/index.css';
```

or only what you use: `css/fonts.css` (Vela Sans), `css/base.css` (tokens + reset + shared classes, required by the
components) and `css/components/<name>.css`:

```ts
import '@flippo-software/component-styles/css/base.css';
import '@flippo-software/component-styles/css/components/button.css';
```

Get the classes from the recipes:

```ts
import { button } from '@flippo-software/component-styles/button';
import { select } from '@flippo-software/component-styles/select';

button({ variant: 'secondary', size: 'small' });
// 'fl-button fl-interactive fl-focus-ring fl-button--secondary fl-button--small fl-text-body-minus-stronger'

const classes = select({ size: 'large' });
classes.trigger; // 'fl-select-trigger fl-control fl-control--light fl-control--large fl-text-body-default'
classes.item;
```

A single-element component has a `cva` recipe that returns a string; a compound component has an `sva` recipe that
returns one class string per part. `VariantsOf<typeof recipe>` gives the variant props.

## How the styles work

- **Classes** are `fl-<component>-<part>`, modifiers `--<option>` (`fl-button--large`). Shared classes
  (`fl-interactive`, `fl-focus-ring`, `fl-popup`, `fl-item`, `fl-control`, `fl-check`, `fl-text-<style>-<weight>`…)
  hold what several components share; the recipes compose them.
- **States** come from the `data-*` attributes of the core machines (`data-checked`, `data-highlighted`,
  `data-popup-open`, `data-disabled`, `data-starting-style`…) and native pseudo-classes. Every state selector is
  wrapped in `:where()`, so the order of the rules decides which state wins.
- **Cascade layers** `fl.reset`, `fl.tokens`, `fl.shared`, `fl.components`: your unlayered styles always win.

### Overriding

Every property reads a public custom property first:

```css
/* background-color: var(--fl-button-bg, var(--_fl-button-bg)) */
.checkout .fl-button--primary {
    --fl-button-bg: var(--fl-color-success);
    --fl-button-bg-hover: var(--fl-color-success-hover);
}
```

`--fl-<component>-<prop>` is never set by the package; `--_fl-…` are private (variants and states set them).

Components built on a shared pattern (popups, controls, items, checks) have two levels of hooks: the pattern's for
all of them and the component's for one. The component's wins:

```css
:root {
    --fl-popup-bg: var(--fl-color-bg-1);   /* menus, selects, popovers, tooltips */
    --fl-tooltip-bg: var(--fl-color-bg-3); /* tooltips only */
}
```

## Tokens and themes

`css/tokens.css` defines on `:root`:

| Group | Example |
| --- | --- |
| Primitive colours | `--fl-color-neutral-90`, `--fl-color-brand-40`, `--fl-color-misc-red-default` |
| Semantic colours | `--fl-color-bg-1`, `--fl-color-text-primary`, `--fl-color-stroke`, `--fl-color-brand-light`, `--fl-color-error` |
| Typography | `--fl-font-family`, `--fl-text-body-size`, `--fl-text-body-weight-stronger` |
| Scale | `--fl-spacing-4` (16px), `--fl-radius-card`, `--fl-size-medium` (48px), `--fl-shadow-popup`, `--fl-duration-fast` |

Semantic colours are `light-dark()` pairs. The page follows the system theme; `data-theme="light"` or
`data-theme="dark"` on any element fixes the theme of its subtree. The dark values are the Figma tokens; the light
theme mirrors the neutral scale.

### Your own themes

A theme is a `[data-theme='<name>']` rule built on a colour scheme. The `fl.theme` mixin writes it: the semantic
colours of the scheme, recomputed from the primitives you override, then your semantic overrides.

```scss
@use '@flippo-software/component-styles/scss' as fl;

@include fl.theme('sepia', light, $colors: ('bg-1': #f6edd9, 'text-primary': #3b2f1e), $primitives: ('brand-40': #8a5a2b));
```

Register its name and scheme with the provider of the kit (`themes={{ sepia: 'light' }}`, `registerThemes`), so it
knows the colour scheme of the theme. `@flippo-software/component-styles/theme` has the framework-free helpers the
providers use: `resolveTheme`, `systemColorScheme`, `subscribeSystemColorScheme`, `readStoredTheme` and `storeTheme`,
the `ThemeSetting` types, and `themeScript({ storageKey })`, the source of an inline `<head>` script that puts the
stored theme on `<html>` before the first paint.

### The size grid of the controls

Controls come in three sizes, each with the height of its row: small 40, medium 48, large 56 (`--fl-size-*`). Inputs,
selects and buttons are that high. A checkbox, a radio or a switch with its label (`.fl-choice-label`, the `label`
part) takes the height of the row: the first line of its text is centred in it and the control is centred on that
line (a longer text wraps below it), so a row of mixed controls aligned at the top (`align-items: flex-start`) looks
centred. Toggles and segmented controls keep their height and reach the row
through block margins. The `compact` variant (of the label, the toggle, the segmented control) drops the row height
(dense tables, lists of options); `--fl-choice-label-row-height`, `--fl-toggle-margin-block` and
`--fl-segmented-control-margin-block` override it.

`@flippo-software/component-styles/sizes` gives the grid to code: `CONTROL_SIZES`, `CONTROL_HEIGHTS`
(`{ small: 40, medium: 48, large: 56 }`, tested against the tokens), `controlHeight(size)`, and `CONTROL_FAMILIES`,
the families whose `size` follows the control size of the application.

## SCSS

```scss
@use '@flippo-software/component-styles/scss' as fl;

.my-card {
    @include fl.text('body', 'stronger');
    @include fl.focus-ring;

    @include fl.hover {
        background-color: var(--fl-color-bg-1-hover);
    }
}

.my-list-item {
    @include fl.item;
}
```

The maps (`fl.$neutral`, `fl.$semantic`, `fl.$text-styles`, `fl.$spacing`…), the token mixins
(`fl.custom-properties`, `fl.semantic-colors('dark')`), the state selectors (`fl.hover`, `fl.checked`,
`fl.disabled`…) and the patterns (`fl.popup`, `fl.control`, `fl.check`, `fl.item`, `fl.backdrop`…) are public.

## Components

accordion, autocomplete, avatar, button, checkbox, checkbox-card, checkbox-group, collapsible, combobox,
context-menu, dialog, drawer, field, fieldset, form, input, link, marquee, menu, menubar, meter, navigation-menu,
number-field, pin-input, popover, progress, qr-code, radio, radio-card, radio-group, scroll-area,
segmented-control, select, separator, slider, snippet, switch, tabs, toast, toggle, toggle-group, toolbar, tooltip.

Fonts: Vela Sans, SIL Open Font License 1.1 (`fonts/LICENSE.txt`).

## Styled adapters and presentation components

The sibling packages `@flippo-software/ui-kit-react` (formerly `flippo-components`) and
`@flippo-software/ui-kit-web` (UI kits) consume these recipes, as a peer dependency: the application installs one
copy of this package for both kits and for its own components. Both expose the same visual component catalog.
They add no component CSS of their own; their `styles.css` imports this package's aggregate stylesheet.

Shared presentation recipes now include `card`, `text`, `code`, `kbd`, `blockquote`, `em`, `strong`, `quote`,
`box`, `flex`, `grid`, `center`, `container`, `section`, `list`, `skeleton`, `skeleton-text`, `spinner` and `textarea`.
Text composes the existing typography classes; the other components use the same light/dark tokens and public CSS hooks.
`--fl-spacing-24` adds the existing Section XL spacing to the shared scale.

The separate `@flippo-software/component-styles/layouts` entry point exports framework-neutral layout prop types
and converters (including `extractPresentationProps`). It has no React dependency. Numeric grid spacing resolves
to `--fl-spacing-*`; layout defaults are in the component CSS so CSS hooks can override them.

Two more entry points serve the adapters, and you can use them in your own components:

- `@flippo-software/component-styles/icons`: `ICONS`, the `IconName` type and `iconMarkup(name)` — the SVG markup of
  the Flippo icons the styled packages use by default (indicators, chevrons, clear and close buttons). The icons draw
  in `currentColor`.
- `@flippo-software/component-styles/dom`: `focusControlOnPress(event, box)`, for a `mousedown` listener on a control
  box (input, textarea, number field, combobox group): a press on its padding or icon focuses the input inside and
  puts the caret at the near end, as a press on the input itself would.

The `qr-code` recipe module also exports `qrCodeOptions`, the renderer options of the styled QR code: an SVG in
`currentColor` on a transparent background, so the code takes `--fl-qr-code-color` and follows the theme.

## Development

This package is part of the [`flippo-ui`](../../README.md) pnpm workspace: run the commands from the root
(`pnpm check`, or `pnpm --filter @flippo-software/component-styles <script>`). The UI kits read its sources (the
`source` export condition), so their Storybook and tests show style changes without a build. Component SCSS uses the
shared mixins and the `--fl-*` tokens; [`AGENTS.md`](./AGENTS.md) lists the conventions.
