---
title: "Flippo UI для Web Components"
---

Стилизованные custom elements дизайн-системы Flippo: поведение — из `@flippo-software/web-components` (те же
машины состояний, что у React-версии), оформление — из `@flippo-software/component-styles`. Работают в обычном HTML
и в любом фреймворке.

## Установка

```sh
pnpm add @flippo-software/ui-kit-web @flippo-software/component-styles
```

```ts
import '@flippo-software/ui-kit-web/styles.css';
import { define } from '@flippo-software/ui-kit-web';

define({ prefix: 'ui', storageKey: 'flippo-theme', size: 'medium' });
```

```html
<ui-button as-child><button type="button">Создать набор</button></ui-button>
```

В этом Storybook элементы зарегистрированы с префиксом `demo`.

## Как читать документацию

- **Страница компонента** начинается с примера и Controls, затем идёт **справочник API**: каждый элемент с атрибутами
  (тип, значение по умолчанию, описание), data-атрибутами для стилизации состояний и CSS-переменными. Ниже —
  варианты оформления и **CSS-хуки** (`--fl-<компонент>-*`).
- **Gallery** — все размеры, варианты и состояния, как на листах компонентов в Figma.
- [Темы и размеры](?path=/docs/overview-themes-and-sizes--docs) — `<demo-provider>`, свои темы, сетка размеров контролов.
- [Токены](?path=/docs/overview-tokens--docs) — цвета, типографика, отступы.
- Панель инструментов переключает тему и язык (английский, русский) документации и историй.
