---
title: "Flippo UI for React"
---

The styled components of the Flippo design system: the behaviour comes from `@flippo-software/react-components`
(the Base UI API: parts `Dialog.Root`, `Dialog.Trigger`…, `render`, data attributes of the states), the look from
`@flippo-software/component-styles` (tokens, themes, `fl-*` classes).

## Install

```sh
pnpm add @flippo-software/ui-kit-react @flippo-software/component-styles
```

```tsx
import '@flippo-software/ui-kit-react/styles.css';
import { Button, FlippoProvider } from '@flippo-software/ui-kit-react';

export function App() {
    return (
        <FlippoProvider storageKey="flippo-theme" size="medium">
            <Button>Create a set</Button>
        </FlippoProvider>
    );
}
```

## How to read these docs

- **A component's page** starts with an example and its Controls, then the **API reference**: each part with its props
  (type, default, description), the data attributes that style its states and its CSS variables. Below come the style
  variants and the **CSS hooks** (`--fl-<component>-*`) for fine-tuning.
- **Gallery** shows every size, variant and state, like the component sheets in Figma.
- [Themes and sizes](?path=/docs/overview-themes-and-sizes--docs): `FlippoProvider`, your own themes, the size grid of
  the controls.
- [Tokens](?path=/docs/overview-tokens--docs): colours, typography, spacing.
- The toolbar switches the theme and the language (English, Russian) of the docs and the stories.
