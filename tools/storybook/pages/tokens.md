---
title: "Tokens"
---

The design tokens are CSS variables on `:root`, from `@flippo-software/component-styles`. The semantic colours are
`light-dark()` pairs: they follow the theme (the theme switch of the Storybook toolbar, `data-theme` in an
application). The values are kept in sync with the variables of the Figma file «Flippo».

## Colours

<!-- slot:palette -->

## Typography

The classes `fl-text-<style>-<weight>` (`weaker`, `default`, `stronger`) or the SCSS mixin `fl.text('<style>', '<weight>')`.

<!-- slot:typeset -->

## Sizes and spacing

| Group | Tokens |
| --- | --- |
| Control row | `--fl-size-small` 40, `--fl-size-medium` 48, `--fl-size-large` 56, `--fl-size-x-small` 24 |
| Spacing (4px grid) | `--fl-spacing-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 · `-12` 48 · `-16` 64 · `-20` 80 · `-24` 96 · `-32` 128; half steps `-1-5` 6, `-2-5` 10 |
| Radii | `--fl-radius-xs` 4 · `-sm` 8 · `-md` 12 · `-lg` 16 · `-xl` 24 · `-2xl` 48 · `-full`; by role `-card`, `-popup`, `-control` |
| Shadows | `--fl-shadow-popup`, `--fl-shadow-modal`, `--fl-shadow-raised` |
| Motion | `--fl-duration-fast` 150ms · `-normal` 200ms · `-slow` 300ms; `--fl-ease-standard`, `-out`, `-emphasized` |
