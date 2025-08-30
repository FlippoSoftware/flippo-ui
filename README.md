# @flippo/internal-test-utils

> Внутренняя библиотека тестовых утилит для Flippo headless UI компонентов

## Обзор

`@flippo/internal-test-utils` - это специализированная библиотека для тестирования headless компонентов в экосистеме Flippo. Она предоставляет набор утилит, которые стандартизируют процесс тестирования и обеспечивают единообразие тестов во всех пакетах.

### Ключевые особенности

- 🧩 **Поддержка compound компонентов** - специальные утилиты для тестирования составных компонентов
- ♿ **Встроенное тестирование доступности** - автоматические проверки a11y
- ⚡ **Мониторинг производительности** - отслеживание времени рендера и обновлений
- 🎯 **Кастомные матчеры** - специфичные для headless UI проверки
- 🌍 **RTL поддержка** - тестирование right-to-left макетов
- 🔄 **Управление событиями** - продвинутое тестирование HeadlessUIEvent

## Установка

```bash
pnpm add @flippo/internal-test-utils --save-dev
```

## Быстрый старт

```typescript
import { init, createRenderer, quickSetup } from '@flippo/internal-test-utils';

// Быстрая настройка для unit тестов
quickSetup.unit();

// Или полная настройка
init({
  enableA11yTesting: true,
  enablePerformanceMonitoring: false,
  debug: false,
});

// Создание renderer'а
const { render } = createRenderer();

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent>Hello</MyComponent>);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```

## Основные функции

### `createRenderer`

Создает стандартизированную функцию рендеринга для headless компонентов.

```typescript
import { createRenderer } from '@flippo/internal-test-utils';

describe('Component tests', () => {
  const { render } = createRenderer({
    direction: 'ltr', // или 'rtl'
    enablePerformanceMonitoring: true,
    autoCleanup: true,
  });

  it('should render with providers', () => {
    const result = render(<MyComponent />);
    // Автоматически получаем:
    // - DirectionProvider
    // - TestIdProvider  
    // - PerformanceMonitor (если включен)
    // - Enhanced утилиты (user, getByTestId, etc.)
  });
});
```

### Тестирование compound компонентов

```typescript
import { testCompoundComponent, testAriaRelationships } from '@flippo/internal-test-utils';

describe('Dialog Component', () => {
  const dialogTester = testCompoundComponent({
    rootComponent: 'Dialog',
    requiredChildren: ['DialogTrigger', 'DialogPopup'],
    provider: DialogProvider,
  });

  it('should connect all parts properly', async () => {
    const utils = await dialogTester.testPartConnections(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>Content</Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );

    // Тест ARIA связей между частями
    await testAriaRelationships({
      renderResult: utils.renderResult,
      relationships: [
        {
          source: 'dialog-trigger',
          target: 'dialog-popup', 
          attribute: 'aria-controls',
        },
      ],
    });
  });
});
```

### Тестирование доступности

```typescript
import { createA11yTestRunner, testKeyboardPatterns, KEYBOARD_PATTERNS } from '@flippo/internal-test-utils';

describe('Accessibility tests', () => {
  it('should pass all a11y checks', async () => {
    const { render } = createRenderer();
    const result = render(<MyComponent />);
    
    const element = result.getByRole('button');
    const a11yRunner = createA11yTestRunner(result, {
      keyboardNavigation: true,
      screenReader: true,
      focusManagement: true,
    });

    const testResults = await a11yRunner.runAllTests(element);
    expect(testResults.every(r => r.passed)).toBe(true);
  });

  it('should support keyboard patterns', async () => {
    const { render } = createRenderer();
    const result = render(<MenuComponent />);
    
    const menu = result.getByRole('menu');
    await testKeyboardPatterns(menu, KEYBOARD_PATTERNS.MENU);
  });
});
```

### Тестирование производительности

```typescript
import { testComponentPerformance, createPerformanceRunner, testStressPerformance } from '@flippo/internal-test-utils';

describe('Performance tests', () => {
  it('should render within performance thresholds', async () => {
    const result = await testComponentPerformance({
      Component: MyExpensiveComponent,
      props: { data: largeDataSet },
      thresholds: {
        maxRenderTime: 100,
        maxUpdateTime: 50,
        maxMemoryUsage: 10,
      },
    });

    expect(result.passed).toBe(true);
  });

  it('should handle multiple updates efficiently', async () => {
    const stressResult = await testStressPerformance({
      Component: MyComponent,
      initialProps: { value: 0 },
      propChanges: Array.from({ length: 100 }, (_, i) => ({ value: i })),
    });

    expect(stressResult.passed).toBe(true);
    expect(stressResult.averageUpdateTime).toBeLessThan(10);
  });
});
```

### Тестирование событий

```typescript
import { createEventTestRunner, testCommonEventPatterns, createMockHeadlessUIEvent } from '@flippo/internal-test-utils';

describe('Event handling', () => {
  it('should handle HeadlessUI events properly', async () => {
    const { render } = createRenderer();
    const onClick = vi.fn();
    
    const result = render(<MyComponent onClick={onClick} />);
    const eventRunner = createEventTestRunner(result);

    await eventRunner.testEventPrevention({
      element: result.getByRole('button'),
      eventType: 'click',
      handler: onClick,
      preventHandler: false, // Test normal flow
    });
  });

  it('should support event prevention', async () => {
    const { render } = createRenderer();
    const result = render(<MyComponent />);

    const patterns = testCommonEventPatterns();
    
    // Test click outside behavior
    await patterns.clickOutside({
      renderResult: result,
      triggerElement: result.getByRole('button'),
      onClickOutside: vi.fn(),
    });

    // Test escape key behavior
    await patterns.escapeKey({
      element: result.getByRole('button'),
      onEscape: vi.fn(),
    });
  });
});
```

### Кастомные матчеры

```typescript
import { initMatchers } from '@flippo/internal-test-utils';

// Инициализация матчеров (обычно в setup файле)
initMatchers();

describe('Custom matchers', () => {
  it('should use headless UI specific matchers', () => {
    const { render } = createRenderer();
    const result = render(<MyComponent />);
    
    const element = result.getByRole('button');

    // Кастомные матчеры для headless компонентов
    expect(element).toHaveHeadlessUIAttributes({
      'aria-expanded': false,
      'aria-controls': null,
    });

    expect(element).toHaveHeadlessFocus();
    expect(element).toHaveEventHandler('click');
    expect(result.container).toHaveCompoundParts(['Trigger', 'Popup']);
  });
});
```

### Условное пропускание тестов

```typescript
import { describeSkipIf } from '@flippo/internal-test-utils';

// Пропуск тестов в зависимости от условий
describeSkipIf(
  !('IntersectionObserver' in window),
  'IntersectionObserver tests',
  () => {
    it('should observe intersections', () => {
      // Тесты, которые требуют IntersectionObserver
    });
  }
);

// Пропуск на основе переменных окружения
describeSkipIf(
  process.env.SKIP_SLOW_TESTS === 'true',
  'Slow performance tests',
  () => {
    it('should pass stress test', () => {
      // Медленные тесты
    });
  }
);
```

## Конфигурация Vitest

Создайте `vitest.config.ts` в вашем проекте:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@flippo/internal-test-utils/setup'], // Автоматическая настройка
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

Или настройте вручную в setup файле:

```typescript
// setup.ts
import { init } from '@flippo/internal-test-utils';

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

## Примеры реального использования

### Тестирование Tooltip компонента

```typescript
import { createRenderer, createHeadlessTestUtils, testAriaRelationships } from '@flippo/internal-test-utils';

describe('Tooltip Component', () => {
  const { render } = createRenderer();

  it('should show/hide on hover', async () => {
    const result = render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Hover me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Tooltip content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    const utils = createHeadlessTestUtils(result);
    const trigger = result.getByText('Hover me');

    await utils.testHoverInteraction({
      trigger,
      expectedContent: 'Tooltip content',
    });
  });

  it('should maintain proper ARIA relationships', async () => {
    // ... render logic ...

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
});
```

### Тестирование Dialog компонента

```typescript
import { testCompoundPatterns, testStateSynchronization } from '@flippo/internal-test-utils';

describe('Dialog Component', () => {
  const dialogTester = testCompoundPatterns().dialog;

  it('should handle state synchronization', async () => {
    const onOpenChange = vi.fn();
    const result = render(
      <Dialog.Root onOpenChange={onOpenChange}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>Content</Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );

    await testStateSynchronization({
      renderResult: result,
      stateChanges: [
        {
          action: async () => {
            await user.click(result.getByText('Open'));
          },
          expectedStates: [
            {
              element: 'dialog-popup',
              attribute: 'aria-hidden',
              value: false,
            },
          ],
        },
      ],
    });
  });
});
```

## API Reference

### Core Functions

- **`createRenderer(options?)`** - Создает renderer с провайдерами
- **`init(config?)`** - Инициализирует тестовую среду
- **`quickSetup`** - Быстрые настройки для разных сценариев

### Testing Utilities

- **`createHeadlessTestUtils(result)`** - Утилиты для headless компонентов
- **`createA11yTestRunner(result, options?)`** - Тестирование доступности
- **`createPerformanceRunner(thresholds?)`** - Тестирование производительности
- **`createEventTestRunner(result)`** - Тестирование событий

### Compound Component Testing

- **`testCompoundComponent(config)`** - Тестирование составных компонентов
- **`testCompoundPatterns()`** - Готовые паттерны для compound компонентов
- **`testAriaRelationships(config)`** - Тестирование ARIA связей
- **`testStateSynchronization(config)`** - Синхронизация состояния

### Custom Matchers

- **`toHaveHeadlessUIAttributes(attrs, options?)`** - Проверка headless атрибутов
- **`toHaveHeadlessFocus()`** - Проверка фокуса (включая виртуальный)
- **`toHaveCompoundParts(parts)`** - Наличие частей compound компонента
- **`toHaveEventHandler(eventType)`** - Наличие обработчика события
- **`toPreventHeadlessUIHandler()`** - Предотвращение default обработчика
- **`toBeProperlyPositioned(position?)`** - Корректное позиционирование

### Event Testing

- **`testCommonEventPatterns()`** - Общие паттерны событий
- **`createMockHeadlessUIEvent(event, options?)`** - Мок HeadlessUIEvent
- **`testEventHandlerMerging(config)`** - Тестирование слияния обработчиков

## Лучшие практики

### 1. Структура тестов

```typescript
import { createRenderer, createHeadlessTestUtils } from '@flippo/internal-test-utils';

describe('ComponentName', () => {
  const { render } = createRenderer();

  it('should handle basic interaction', async () => {
    const result = render(<Component />);
    const utils = createHeadlessTestUtils(result);
    
    // Используйте utils для специфичного тестирования
    await utils.testHoverInteraction({
      trigger: result.getByRole('button'),
      expectedContent: 'Expected content',
    });
  });
});
```

### 2. Тестирование производительности

```typescript
import { testComponentPerformance } from '@flippo/internal-test-utils';

it('should meet performance requirements', async () => {
  await testComponentPerformance({
    Component: MyComponent,
    props: { complexProp: largeData },
    thresholds: {
      maxRenderTime: 100,
      maxUpdateTime: 50,
    },
  });
});
```

### 3. Организация accessibility тестов

```typescript
import { createA11yTestRunner, KEYBOARD_PATTERNS } from '@flippo/internal-test-utils';

describe('Accessibility', () => {
  it('should pass all a11y tests', async () => {
    const result = render(<Component />);
    const runner = createA11yTestRunner(result);
    
    await runner.runAllTests(result.container);
  });
});
```

## Дебаггинг

Включите debug режим для получения дополнительной информации:

```typescript
import { setupDebugMode } from '@flippo/internal-test-utils';

setupDebugMode();

// Теперь доступны глобальные функции:
debugElement(element); // Информация об элементе
debugDOM(); // Текущее состояние DOM
```

## Миграция с других тестовых библиотек

### С @testing-library/react

```typescript
// Старый код
import { render } from '@testing-library/react';

// Новый код
import { createRenderer } from '@flippo/internal-test-utils';
const { render } = createRenderer();
```

### С кастомными setup файлами

```typescript
// Вместо множества setup файлов
import { quickSetup } from '@flippo/internal-test-utils';

quickSetup.unit(); // или integration, performance, accessibility
```

## Интеграция с CI/CD

```typescript
// В CI окружении
import { init } from '@flippo/internal-test-utils';

init({
  enablePerformanceMonitoring: process.env.CI === 'true',
  debug: process.env.DEBUG_TESTS === 'true',
  performanceThresholds: {
    maxRenderTime: process.env.CI ? 200 : 100, // Более мягкие лимиты в CI
  },
});
```

## Troubleshooting

### Распространенные проблемы

1. **"Custom matchers not found"**
   ```typescript
   // Убедитесь что вызвали инициализацию
   import { init } from '@flippo/internal-test-utils';
   init();
   ```

2. **"JSDOM errors"**
   ```typescript
   // Убедитесь что JSDOM правильно настроен в vitest.config.ts
   export default defineConfig({
     test: {
       environment: 'jsdom',
     },
   });
   ```

3. **"Performance tests fail in CI"**
   ```typescript
   // Настройте разные пороги для CI
   const thresholds = process.env.CI 
     ? { maxRenderTime: 200, maxUpdateTime: 100 }
     : { maxRenderTime: 100, maxUpdateTime: 50 };
   ```

## Внутренняя архитектура

Библиотека построена с акцентом на:

- **Модульность** - каждая утилита независима
- **Расширяемость** - легко добавлять новые матчеры и утилиты  
- **Производительность** - минимальный overhead для тестов
- **Типобезопасность** - полная поддержка TypeScript
- **Совместимость** - работа с различными тестовыми фреймворками

Библиотека специально адаптирована для headless UI компонентов и учитывает их особенности:
- Compound component pattern
- HeadlessUIEvent система
- Управление фокусом и доступностью
- Floating UI интеграция
- Portal рендеринг

## Примеры

Смотрите полные примеры использования в папке `/src/examples/` этого пакета.

---

**Важно**: Эта библиотека предназначена для внутреннего использования в экосистеме Flippo и оптимизирована под специфику headless UI компонентов.
