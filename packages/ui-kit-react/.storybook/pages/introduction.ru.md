---
title: "Flippo UI для React"
l10n: { source: "8001f67e1462" }
---

Стилизованные компоненты дизайн-системы Flippo: поведение — из `@flippo-software/react-components` (API Base UI:
части `Dialog.Root`, `Dialog.Trigger`…, `render`, data-атрибуты состояний), оформление — из
`@flippo-software/component-styles` (токены, темы, классы `fl-*`).

## Установка

```sh
pnpm add @flippo-software/ui-kit-react @flippo-software/component-styles
```

```tsx
import '@flippo-software/ui-kit-react/styles.css';
import { Button, FlippoProvider } from '@flippo-software/ui-kit-react';

export function App() {
    return (
        <FlippoProvider storageKey="flippo-theme" size="medium">
            <Button>Создать набор</Button>
        </FlippoProvider>
    );
}
```

## Как читать документацию

- **Страница компонента** начинается с примера и Controls, затем идёт **справочник API**: каждая часть с props
  (тип, значение по умолчанию, описание), data-атрибутами для стилизации состояний и CSS-переменными. Ниже —
  варианты оформления и **CSS-хуки** (`--fl-<компонент>-*`) для точечной настройки.
- **Gallery** — все размеры, варианты и состояния, как на листах компонентов в Figma.
- [Темы и размеры](?path=/docs/overview-themes-and-sizes--docs) — `FlippoProvider`, свои темы, сетка размеров контролов.
- [Токены](?path=/docs/overview-tokens--docs) — цвета, типографика, отступы.
- Панель инструментов переключает тему и язык (английский, русский) документации и историй.
