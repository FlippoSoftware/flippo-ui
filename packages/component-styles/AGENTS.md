# @flippo-software/component-styles — notes for agents

Tokens, reset, themes and component styles of the Flippo design system, plus class recipes
(`@lynstack/class-recipe`) for every component. The UI kits of the same workspace (`../ui-kit-react`,
`../ui-kit-web`) use it, from its sources in development (`source` export condition). `README.md` is the user documentation. Design source: Figma file
`aDeyWgtfVrpzMmxGA8RcT7` ("Flippo", page "Components & Foundations"); keep tokens in sync with its variables.

## Layout

```
scss/                             public SCSS API (published as is): `@use '…/scss' as fl`
  tokens/_color|_typography|_scale.scss   token maps (primitives, semantic (light, dark) pairs, text styles, scale)
  mixins/_tokens.scss             write the tokens as custom properties
  mixins/_state.scss              state selectors (hover, active, checked, selected, open, invalid, disabled…)
  mixins/_patterns.scss           shared patterns: icon, interactive, focus-ring, popup, backdrop, arrow, item, control,
                                  control-button, check, choice-label, choice-group, choice-card
src/styles/                       entry stylesheets → dist/css: tokens, reset, shared, base, fonts, index (generated)
src/components/<name>/
  <name>.scss                     the component's classes (layer fl.components); some only @use another (meter)
  index.ts                        its recipe: cva (one element) or sva (slots)
src/index.ts                      re-exports every recipe
src/theme/, src/sizes/            framework-free theme helpers and the control size grid (entries `theme`, `sizes`)
scripts/build-css.ts              compiles the stylesheets, generates src/styles/index.scss
test/styles.test.ts               recipes ⊆ CSS classes, tokens defined, private vars read, layers
fonts/                            Vela Sans woff2 (OFL)
```

## Rules (decided with the user — keep them)

- Classes `fl-<component>-<part>`, modifiers `--<option>`; states only from `data-*` / ARIA / pseudo-classes.
- Every property reads `var(--fl-<x>-<prop>, var(--_fl-<x>-<prop>[, token]))`. The package never sets public
  `--fl-<component>-*`; variants and states set the private `--_fl-*`. Global tokens are `--fl-color|spacing|radius|size|text|font|shadow|duration|ease|z|border-width|focus-*` — never
  name a component hook after these groups.
- Shared patterns read `var(--_fl-<p>-<prop>-hook, var(--fl-<p>-<prop>, var(--_fl-<p>-<prop>, token)))`. A component
  passes its own hook without a fallback (`--_fl-popup-bg-hook: var(--fl-tooltip-bg)`; unset = invalid, so `var()`
  falls through) and its default separately (`--_fl-popup-bg: var(--fl-color-bg-3)`): component hook > pattern hook >
  defaults. Tested.
- No duplicated CSS: shared styles are mixins in `scss/mixins/_patterns.scss`, emitted once as shared classes in
  `src/styles/shared.scss`, and composed by recipes. Component stylesheets do not `@include` patterns.
- One CSS property in one place (class-recipe rule): a component never sets a property its shared class sets — it sets
  the shared class's private variable (`--_fl-popup-bg`, `--_fl-control-height`). Modifiers only set variables.
- State selectors from `state.scss` (all `:where()`), ordered weakest → strongest in each rule set.
- Popups must work in the top layer (web components) and in portals (React): no positioning that relies on a parent.
  In the top layer a part is a `[popover]`, sized `fit-content` by the browser: full-screen parts (backdrops,
  drawers) set their size explicitly. `@layer flippo-top-layer` (the web-components reset) comes first in `_layers`.
- Every part sets its `display`: in web components the parts are custom elements, `inline` by default.
- Icon sizes: every Flippo icon (`svg[data-icon]`) and every `.fl-icon` wrapper (the `icon` pattern) is
  `var(--fl-icon-size, var(--_fl-icon-size, 1lh))` — by default the line height of the component's text. A component
  sets `--_fl-icon-size` per size (controls: 24/20/18) rather than sizing its `<svg>` children; some older parts still
  size them in their own rules.
- Size grid: control rows are `--fl-size-small|medium|large` (40/48/56); `src/sizes` mirrors them (tested) and lists
  `CONTROL_FAMILIES`, the families whose `size` takes the application's control size — add a family there when its
  `size` means a control height (not a width, like Dialog). Smaller controls reach the row height without changing their own
  size: choices through their label (`.fl-choice-label` padding centres its first line in the row; the control,
  `.fl-choice-control` with its `--_fl-choice-control-height`, is centred on that line by its margins), toggles and segmented controls through
  `margin-block`; `compact` drops it.
- Themes: `[data-theme='<name>']` rules; custom ones through the `fl.theme` mixin, which re-declares the semantic
  colours and shadows (custom properties resolve `var()` where declared).
- Default icons of the styled packages come from `src/icons` (`@flippo-software/component-styles/icons`, from
  `../icons/svgs`); indicators show `[data-icon=check]`, or `[data-icon=minus]` when indeterminate (`check` pattern).

## Commands

`pnpm lint:check`, `pnpm typecheck`, `pnpm test`, `pnpm build` (tsdown, then `scripts/build-css.ts`). Biome does not
lint SCSS. Never commit, push or publish unless asked.
