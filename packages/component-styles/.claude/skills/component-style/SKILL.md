---
name: component-style
description: Use when adding or changing styles in @flippo-software/component-styles — a component stylesheet and its class recipe, a shared pattern, a token or the themes. Covers the variable convention, state selectors, layers, shared classes vs mixins, recipes with cva/sva and the checks that guard them.
---

# Adding or changing component styles

Read `AGENTS.md` first; its rules are the user's decisions.

## 1. Find the parts and states

- Parts: the folders in `../web-components/src/components/<name>/` (and headless parts).
- States: the `*DataAttributes` enums and `getStateAttributesProps` keys in `../core-components/src/components/<name>/`
  (a state key becomes `data-<kebab-key>`); CSS variables from `*CssVars` enums (`--active-tab-left`,
  `--available-height`, `--transform-origin`…).
- Design: Figma "Flippo" → "Components & Foundations"; tokens in `scss/tokens/`. A component not drawn in Figma is
  built from the nearest drawn one (sizes 56/48/40/24, pill radius, bg-1/bg-2/bg-3 surfaces, brand-light accents).

## 2. Write `src/components/<name>/<name>.scss`

```scss
@use '../../styles/layers';
@use '../../../scss' as fl;

@layer fl.components {
    .fl-name-part {
        --_fl-popup-bg-hook: var(--fl-name-bg);     // the component's hook, never with a fallback
        --_fl-popup-bg: var(--fl-color-bg-2);       // the component's default for the shared class
        gap: var(--fl-name-gap, var(--_fl-name-gap, var(--fl-spacing-2)));

        @include fl.hover { color: var(--fl-name-color-hover, var(--_fl-name-color-hover, var(--fl-color-text-strong))); }
        @include fl.disabled { color: var(--fl-color-text-disabled); }
    }

    .fl-name-part--large { --_fl-name-gap: var(--fl-spacing-3); }   // modifiers only set variables
}
```

- Never set a property that a composed shared class sets; set its `--_fl-<pattern>-*` variable instead.
- States through `fl.<state>` mixins, weakest first; `@include` of patterns is for `shared.scss` and consumers only.
- Something two components share becomes a pattern mixin in `scss/mixins/_patterns.scss` + a class in
  `src/styles/shared.scss`.

## 3. Write the recipe `src/components/<name>/index.ts`

`cva` for one element, `sva` for parts. Base = component class + shared classes + text class; variants map to
modifier classes; declare every option (use `''` / `{}` for none); export `VariantsOf` types for variants. Reuse
another recipe's output (`button({ … })`) instead of copying classes. Add the export to `src/index.ts` (it lists
every component folder).

## 4. Check

`pnpm test` fails on a recipe class missing from the CSS, an undefined token, a private variable set but never
read, or a stylesheet outside the layer. Then `pnpm lint:check`, `pnpm typecheck`, `pnpm build`. Update `README.md`
(component list) and this repo's `AGENTS.md` when rules or layout change.
