---
title: "Токены"
l10n: { source: "8229a0ec7efb" }
---

Токены дизайн-системы — CSS-переменные на `:root` из `@flippo-software/component-styles`. Семантические цвета —
пары `light-dark()`: они следуют теме (переключатель темы на панели Storybook, `data-theme` в приложении). Значения
синхронизированы с переменными Figma «Flippo».

## Цвета

<!-- slot:palette -->

## Типографика

Классы `fl-text-<стиль>-<насыщенность>` (`weaker`, `default`, `stronger`) или SCSS-миксин `fl.text('<стиль>', '<насыщенность>')`.

<!-- slot:typeset -->

## Размеры и отступы

| Группа | Токены |
| --- | --- |
| Строка контролов | `--fl-size-small` 40, `--fl-size-medium` 48, `--fl-size-large` 56, `--fl-size-x-small` 24 |
| Отступы (сетка 4px) | `--fl-spacing-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 · `-12` 48 · `-16` 64 · `-20` 80 · `-24` 96 · `-32` 128; половинные шаги `-1-5` 6, `-2-5` 10 |
| Скругления | `--fl-radius-xs` 4 · `-sm` 8 · `-md` 12 · `-lg` 16 · `-xl` 24 · `-2xl` 48 · `-full`; по ролям `-card`, `-popup`, `-control` |
| Тени | `--fl-shadow-popup`, `--fl-shadow-modal`, `--fl-shadow-raised` |
| Анимация | `--fl-duration-fast` 150ms · `-normal` 200ms · `-slow` 300ms; `--fl-ease-standard`, `-out`, `-emphasized` |
