# Руководство по интеграции @flippo/internal-test-utils

## Интеграция с существующими компонентами

### 1. Обновление конфигурации headless-components

Добавьте в `packages/ui/uikit/headless/components/package.json`:

```json
{
  "devDependencies": {
    "@flippo/internal-test-utils": "workspace:*"
  }
}
```

### 2. Обновление Vitest конфигурации

Обновите `packages/ui/uikit/headless/components/vite.config.ts`:

```typescript
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@flippo/internal-test-utils/setup'], // Используем готовую настройку
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.test.*'],
    },
  },
  // ... остальная конфигурация
});
```

### 3. Обновление setup файла

Замените содержимое `packages/ui/uikit/headless/components/src/test/setup.ts`:

```typescript
import { init } from '@flippo/internal-test-utils';

// Инициализация с настройками для headless компонентов
init({
  enableA11yTesting: true,
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
  debug: process.env.DEBUG_TESTS === 'true',
  defaultDirection: 'ltr',
  performanceThresholds: {
    maxRenderTime: 100,
    maxUpdateTime: 50,
    maxMemoryUsage: 10,
  },
});
```

### 4. Миграция существующих тестов

#### Tooltip тесты

Существующий тест:
```typescript
// src/components/Tooltip/root/TooltipRoot.test.tsx
import React from 'react';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tooltip } from '..';

describe('tooltipRoot', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should open and close on hover', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        // ... rest of test
    });
});
```

Обновленный тест с @flippo/internal-test-utils:
```typescript
// src/components/Tooltip/root/TooltipRoot.test.tsx
import React from 'react';
import { describe, it, vi } from 'vitest';
import { 
  createRenderer, 
  createHeadlessTestUtils,
  testAriaRelationships,
  createA11yTestRunner,
  expect,
} from '@flippo/internal-test-utils';

import { Tooltip } from '..';

describe('TooltipRoot', () => {
  const { render } = createRenderer();

  it('should open and close on hover', async () => {
    const result = render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Popup</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    const utils = createHeadlessTestUtils(result);
    const trigger = result.getByText('Trigger');

    // Используем специализированную утилиту для hover тестов
    await utils.testHoverInteraction({
      trigger,
      expectedContent: 'Popup',
      shouldAppear: true,
    });
  });

  it('should pass accessibility tests', async () => {
    const result = render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Accessible trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Accessible content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    // Автоматическое тестирование доступности
    const trigger = result.getByText('Accessible trigger');
    const a11yRunner = createA11yTestRunner(result);
    
    const results = await a11yRunner.runAllTests(trigger);
    expect(results.every(r => r.passed)).toBe(true);

    // Проверка ARIA связей
    await testAriaRelationships({
      renderResult: result,
      relationships: [
        {
          source: 'tooltip-trigger',
          target: 'tooltip-popup', 
          attribute: 'aria-describedby',
        },
      ],
    });
  });

  it('should handle state changes correctly', async () => {
    const onOpenChange = vi.fn();
    
    const result = render(
      <Tooltip.Provider>
        <Tooltip.Root onOpenChange={onOpenChange}>
          <Tooltip.Trigger>State trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>State content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    const utils = createHeadlessTestUtils(result);
    const trigger = result.getByText('State trigger');

    // Тестирование состояния через утилиты
    await utils.testStateChange({
      trigger,
      action: async () => {
        await result.user.hover(trigger);
      },
      expectedStateChange: async () => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      },
    });
  });
});
```

### 5. Создание тестов для новых компонентов

Пример структуры теста для нового компонента:

```typescript
// src/components/NewComponent/NewComponent.test.tsx
import React from 'react';
import { describe, it, vi } from 'vitest';
import { 
  createRenderer,
  createHeadlessTestUtils,
  testComponentPerformance,
  createA11yTestRunner,
  expect,
} from '@flippo/internal-test-utils';

import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  const { render } = createRenderer();

  describe('Basic functionality', () => {
    it('should render correctly', () => {
      const result = render(<NewComponent>Test content</NewComponent>);
      expect(result.getByText('Test content')).toBeInTheDocument();
    });

    it('should handle props correctly', () => {
      const onClick = vi.fn();
      const result = render(
        <NewComponent onClick={onClick}>
          Clickable content
        </NewComponent>
      );

      const element = result.getByText('Clickable content');
      result.user.click(element);
      
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should pass all accessibility tests', async () => {
      const result = render(<NewComponent>Accessible content</NewComponent>);
      
      const element = result.getByText('Accessible content');
      const a11yRunner = createA11yTestRunner(result);
      
      const results = await a11yRunner.runAllTests(element);
      expect(results.every(r => r.passed)).toBe(true);
    });

    it('should support keyboard navigation', async () => {
      const result = render(<NewComponent tabIndex={0}>Focusable</NewComponent>);
      const utils = createHeadlessTestUtils(result);
      const element = result.getByText('Focusable');

      await utils.testKeyboardNavigation({
        trigger: element,
        key: 'Enter',
      });
    });
  });

  describe('Performance', () => {
    it('should render within performance thresholds', async () => {
      await testComponentPerformance({
        Component: NewComponent,
        props: { children: 'Performance test' },
        thresholds: {
          maxRenderTime: 50,
          maxUpdateTime: 25,
        },
      });
    });
  });

  describe('Custom behavior', () => {
    it('should use headless UI specific matchers', () => {
      const result = render(
        <NewComponent 
          role="button" 
          aria-expanded="false"
          data-testid="custom-component"
        >
          Custom content
        </NewComponent>
      );

      const element = result.getByTestId('custom-component');

      // Используем кастомные матчеры
      expect(element).toHaveHeadlessUIAttributes({
        'role': 'button',
        'aria-expanded': false,
      });

      expect(element).toHaveEventHandler('click');
    });
  });
});
```

## Рекомендуемая структура тестов

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.test.tsx         # Основные тесты
│   │   ├── ComponentName.a11y.test.tsx    # Тесты доступности
│   │   ├── ComponentName.perf.test.tsx    # Тесты производительности
│   │   └── parts/
│   │       ├── Part1/
│   │       │   ├── Part1.tsx
│   │       │   └── Part1.test.tsx
│   │       └── Part2/
│   │           ├── Part2.tsx
│   │           └── Part2.test.tsx
│   └── ...
```

## Паттерны тестирования для разных типов компонентов

### Compound Components (Dialog, Menu, Tooltip)

```typescript
import { testCompoundPatterns, testStateSynchronization } from '@flippo/internal-test-utils';

const componentTester = testCompoundPatterns().dialog; // или menu, tooltip
await componentTester.testPartConnections(ui);
await testStateSynchronization({ renderResult, stateChanges });
```

### Form Components (Input, Checkbox, Select)

```typescript
import { createHeadlessTestUtils, createEventTestRunner } from '@flippo/internal-test-utils';

const utils = createHeadlessTestUtils(result);
const eventRunner = createEventTestRunner(result);

await utils.testEventHandler({
  element: input,
  event: 'change',
  handler: onChange,
  expectedArgs: [{ target: { value: 'test' } }],
});
```

### Interactive Components (Button, Toggle, Switch)

```typescript
import { testKeyboardPatterns, KEYBOARD_PATTERNS } from '@flippo/internal-test-utils';

await testKeyboardPatterns(button, KEYBOARD_PATTERNS.BUTTON);
```

### Floating Components (Popover, ContextMenu)

```typescript
expect(popup).toBeProperlyPositioned({
  top: 100,
  left: 50,
});
```

## Запуск тестов

```bash
# Запуск всех тестов
pnpm test

# Запуск тестов в watch режиме
pnpm test:watch

# Запуск тестов с UI
pnpm test:ui

# Запуск только accessibility тестов
pnpm test -- --grep="accessibility|a11y"

# Запуск только performance тестов
pnpm test -- --grep="performance|perf"

# Запуск в debug режиме
DEBUG_TESTS=true pnpm test

# Пропуск медленных тестов
SKIP_SLOW_TESTS=true pnpm test
```

## Миграция по шагам

1. **Установите пакет** в headless-components
2. **Обновите vitest.config.ts** для использования готового setup
3. **Мигрируйте по одному компоненту** начиная с простых
4. **Добавьте accessibility тесты** для каждого компонента
5. **Настройте performance тесты** для критически важных компонентов
6. **Добавьте интеграционные тесты** между компонентами

Это поможет постепенно перейти на новую систему тестирования без нарушения существующих тестов.
