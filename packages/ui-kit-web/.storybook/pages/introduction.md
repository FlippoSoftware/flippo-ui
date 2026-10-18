---
title: "Flippo UI for Web Components"
---

The styled custom elements of the Flippo design system: the behaviour comes from `@flippo-software/web-components`
(the same state machines as the React version), the look from `@flippo-software/component-styles`. They work in plain
HTML and in any framework.

## Install

```sh
pnpm add @flippo-software/ui-kit-web @flippo-software/component-styles
```

```ts
import '@flippo-software/ui-kit-web/styles.css';
import { define } from '@flippo-software/ui-kit-web';

define({ prefix: 'ui', storageKey: 'flippo-theme', size: 'medium' });
```

```html
<ui-button as-child><button type="button">Create a set</button></ui-button>
```

In this Storybook the elements are registered with the `demo` prefix.

## How to read these docs

- **A component's page** starts with an example and its Controls, then the **API reference**: each element with its
  attributes (type, default, description), the data attributes that style its states and its CSS variables. Below
  come the style variants and the **CSS hooks** (`--fl-<component>-*`).
- **Gallery** shows every size, variant and state, like the component sheets in Figma.
- [Themes and sizes](?path=/docs/overview-themes-and-sizes--docs): `<demo-provider>`, your own themes, the size grid of
  the controls.
- [Tokens](?path=/docs/overview-tokens--docs): colours, typography, spacing.
- The toolbar switches the theme and the language (English, Russian) of the docs and the stories.
