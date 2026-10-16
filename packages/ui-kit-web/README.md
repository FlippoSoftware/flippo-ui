# @flippo-software/ui-kit-web

Styled custom elements over `@flippo-software/web-components`. The underlying core machines keep keyboard, pointer, form and accessibility behaviour. Recipes and CSS are shared with `@flippo-software/ui-kit-react` through `@flippo-software/component-styles`.

## Install

`@flippo-software/component-styles` is a peer dependency: install it next to the kit, so the application has one copy
of the styles (shared with `@flippo-software/ui-kit-react` and with your own components built on the same recipes).

```sh
pnpm add @flippo-software/ui-kit-web @flippo-software/component-styles
```

## Usage

```ts
import '@flippo-software/ui-kit-web/styles.css';
import { define } from '@flippo-software/ui-kit-web';

define({ prefix: 'ui' });
// Or register only selected families:
// define({ prefix: 'ui', components: ['button', 'card', 'text'] });
```

```html
<ui-card>
  <ui-card-content>
    <ui-card-title as-child><h3>Profile</h3></ui-card-title>
    <ui-text color="secondary">Shared styles in React and custom elements.</ui-text>
    <ui-button size="small" variant="secondary" as-child>
      <button type="button">Save</button>
    </ui-button>
  </ui-card-content>
</ui-card>
```

Use the headless API's `as-child` when native semantics are needed: anchors, input/textarea controls, headings, form elements, etc. No framework-owned children are moved or replaced. Classes follow the actual target, including when it is replaced; disconnect removes only classes applied by the adapter. Popups retain the headless package's top-layer placement.

The prefix is required, and can be registered in a supplied custom-element registry. Use different prefixes for headless and styled elements. `define` is idempotent for already registered names.

## Variants and parts

All shared recipe variants are attributes and camelCase properties: `size="small"`, `appearance="inverted"`, `icon-only`, etc. Boolean attributes accept absent, present and `="false"`. Variants on the family root flow to parts; local attributes/properties take precedence. Changes update classes through the existing reactive element lifecycle.

Each family has an entry point, e.g. `@flippo-software/ui-kit-web/dialog`, exporting styled element constructors, `elements`, and `define`. The root exports constructors and `components.<family>.<part>`. Visual parts absent from the headless package, such as Dialog actions and Accordion content, are included. `define` also registers the Combobox dependency for Autocomplete and the Menu dependency for ContextMenu/Menubar, including when selecting individual families.

```html
<ui-field name="name">
  <ui-field-label>Name</ui-field-label>
  <ui-input size="small">
    <ui-input-control as-child><input value="Alice" /></ui-input-control>
    <ui-input-clear as-child><button type="button">×</button></ui-input-clear>
  </ui-input>
</ui-field>

<ui-textarea>
  <ui-textarea-control as-child><textarea aria-label="Message"></textarea></ui-textarea-control>
</ui-textarea>

<ui-grid columns="3" spacing="4">
  <ui-grid-item col-span="2">Main</ui-grid-item>
  <ui-grid-item>Aside</ui-grid-item>
</ui-grid>
```

Input.Clear uses the native input event, so Field still owns value changes and validation. Input/textarea containers follow their control's disabled and invalid states; their field control (`<ui-input-control>`) takes `default-value` and `disabled`, and a press anywhere in the box focuses the input. Indicators, chevrons and clear/close/copy buttons get default Flippo icons (`iconMarkup` from the root entry); children replace them.

## Default props

Default attribute values of the kit's families, as in `@flippo-software/ui-kit-react`'s `DefaultPropsProvider` and
with the same config: a family's key is its name in camelCase (`button`, `select`, `segmentedControl`), its entry holds
the root's (or the only element's) properties and, under a part's name (`positioner`), that part's.

```ts
define({ prefix: 'ui', defaults: { button: { size: 'small' }, select: { size: 'small', positioner: { sideOffset: 4 } } } });
// Or later, for the whole page:
setDefaultProps({ button: { size: 'small' } });
```

`define` also registers `<ui-default-props>`: its `defaults` property overrides the global defaults in its subtree
(it renders as `display: contents`), and nested ones merge with the outer ones. Changes apply at once.

An attribute or a property set on an element wins, then the part's entry, then what the root passes down to its parts,
then the family's entry, then the kit's built-in defaults. `DefaultProps` types the config from the families.

## Shared catalog

Every family in `web-components` is covered. Input, Textarea, Link and the presentation families are also included: Card, Text, Code, Kbd, Blockquote, Em, Strong, Quote, Box, Flex, Grid, Center, Container, Section, List, Skeleton, SkeletonText, Spinner and Slot. Presentation elements add styling; use `as-child` with native markup to supply semantics. List presentation parts do not add React's composite List behaviour.

Layout attributes use kebab-case (`col-span`, `max-width`, `align-self`); properties use camelCase. The same layout resolver is used in React. Container and Section sizes use shared CSS; numeric `spacing` uses `--fl-spacing-*` tokens. Arbitrary CSS customization uses the public hooks from `component-styles`.

The JS entry points require a browser/custom-element environment. Import the stylesheet once, or select `component-styles/css/base.css`, `fonts.css` and individual component CSS files (including composed recipes' CSS).

## Local development

This package is part of the `flippo-ui` pnpm workspace (see the root README): install and run the checks from the root
(`pnpm install`, `pnpm check`), or one package with `pnpm --filter @flippo-software/ui-kit-web <script>`. It reads
`component-styles` from its sources in Storybook, tests and typecheck, so style changes show up without a build.
The behaviour packages it uses (web-components, core-components, store) come from the workspace and their `dist`: rebuild
them after a change (`pnpm build`, or keep `pnpm dev` running at the root).

## Stories and tests

Stories live in `src/components/<name>/__stories__/`, tests in `__tests__/` folders next to the code they test
(`src/__tests__/` for the kit as a whole). Both import the kit from `~@src`, the stories their helpers from `~@stories`
(tsconfig `paths`, `aliases.ts` for Vite).

## Storybook

Each component keeps its stories next to it, in `src/components/<name>/__stories__/` (one CSF page for each of the 63
public component families), in Russian, with the same
catalog groups and content in both packages. Each page has a `Default` story with Controls for the recipe variants,
and a `Gallery` (some also `Examples`) laid out like the Figma component sheets: sections of labelled rows with the
sizes, variants and states, and realistic compositions from the Flippo screens. The gallery layout (`src/__stories__`, imported as `~@stories`)
and its CSS (`.storybook/preview.css`, `.sb-*` classes) are shared by both packages. The toolbar switches light/dark
themes (dark by default), including overlays in the top layer.

```sh
# From the workspace root
pnpm storybook:web
# Static output in packages/ui-kit-web/storybook-static/
pnpm --filter @flippo-software/ui-kit-web build-storybook
```

Web Components runs on port **6007** and registers the `demo` prefix. Stories render native custom elements;
`qr-code-styling` is a development-only renderer for the QR example. Toast uses the provider API and a template
inside its viewport. No React runtime is used by the Web stories.
