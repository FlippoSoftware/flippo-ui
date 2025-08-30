# @flippo/internal-test-utils - Обзор библиотеки

## 🎯 Цель

Библиотека `@flippo/internal-test-utils` создана специально для тестирования headless UI компонентов экосистемы Flippo. Она решает специфичные задачи, которые возникают при тестировании unstyled компонентов с compound архитектурой.

## 🧩 Архитектура

### Основные принципы

1. **Headless-First**: Утилиты адаптированы под особенности headless компонентов
2. **Compound Pattern**: Поддержка тестирования составных компонентов (Root + Parts)
3. **Event System**: Интеграция с HeadlessUIEvent системой
4. **Accessibility**: Встроенное a11y тестирование по умолчанию
5. **Performance**: Мониторинг производительности из коробки

### Структура пакета

```
@flippo/internal-test-utils/
├── renderer/           # Рендеринг компонентов
│   ├── createRenderer  # Основная функция рендеринга
│   └── providers/      # Тестовые провайдеры
├── utils/              # Специализированные утилиты
│   ├── headless       # Утилиты для headless компонентов
│   ├── accessibility  # A11y тестирование
│   ├── performance    # Performance мониторинг
│   ├── events         # Тестирование событий
│   └── compound       # Тестирование compound компонентов
├── matchers/          # Кастомные Jest/Vitest матчеры
├── setup/             # Настройка тестовой среды
├── types/             # TypeScript типы
└── examples/          # Примеры использования
```

## 🚀 Ключевые особенности

### 1. Стандартизированный рендеринг

```typescript
const { render } = createRenderer({
  direction: 'ltr',           // RTL/LTR поддержка
  enablePerformanceMonitoring: true,  // Мониторинг производительности
  autoCleanup: true,          // Автоочистка между тестами
});
```

### 2. Специализированные утилиты

```typescript
const utils = createHeadlessTestUtils(result);

// Тестирование hover взаимодействий
await utils.testHoverInteraction({
  trigger: button,
  expectedContent: 'Tooltip text',
});

// Тестирование keyboard навигации
await utils.testKeyboardNavigation({
  trigger: menuItem,
  key: 'ArrowDown',
  expectedTarget: nextMenuItem,
});
```

### 3. Compound Component тестирование

```typescript
const dialogTester = testCompoundPatterns().dialog;

await dialogTester.testPartConnections(
  <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Popup>Content</Dialog.Popup>
  </Dialog.Root>
);
```

### 4. Accessibility из коробки

```typescript
const a11yRunner = createA11yTestRunner(result);
const results = await a11yRunner.runAllTests(element);

// Автоматически тестирует:
// - Keyboard navigation
// - Screen reader support  
// - Focus management
// - ARIA relationships
```

### 5. Performance мониторинг

```typescript
await testComponentPerformance({
  Component: ExpensiveComponent,
  thresholds: {
    maxRenderTime: 100,
    maxUpdateTime: 50,
  },
});
```

### 6. Кастомные матчеры

```typescript
expect(element).toHaveHeadlessUIAttributes({
  'aria-expanded': false,
  'role': 'button',
});

expect(popup).toBeProperlyPositioned({ top: 100, left: 50 });
expect(element).toHaveHeadlessFocus();
```

## 🎨 Отличия от @mui/internal-test-utils

| Особенность | @mui/internal-test-utils | @flippo/internal-test-utils |
|-------------|--------------------------|------------------------------|
| **Целевые компоненты** | Styled компоненты MUI | Headless компоненты Flippo |
| **Архитектура** | Monolithic компоненты | Compound компоненты |
| **Event System** | Стандартные React события | HeadlessUIEvent система |
| **Styling** | Theme-based тестирование | Position-based тестирование |
| **Accessibility** | Базовая a11y поддержка | Продвинутая a11y валидация |
| **Performance** | Общий мониторинг | Headless-специфичные метрики |

## 📋 Сравнение с стандартным подходом

### Без @flippo/internal-test-utils

```typescript
describe('Tooltip', () => {
  it('should show on hover', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    const trigger = screen.getByText('Trigger');
    
    await user.hover(trigger);
    await waitFor(() => expect(screen.getByText('Content')).toBeInTheDocument());
    
    await user.unhover(trigger);
    await waitForElementToBeRemoved(() => screen.queryByText('Content'));
  });
});
```

### С @flippo/internal-test-utils

```typescript
describe('Tooltip', () => {
  const { render } = createRenderer(); // Автонастройка провайдеров

  it('should show on hover', async () => {
    const result = render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    const utils = createHeadlessTestUtils(result);
    const trigger = result.getByText('Trigger');

    // Все логика hover тестирования инкапсулирована
    await utils.testHoverInteraction({
      trigger,
      expectedContent: 'Content',
    });
  });

  // Bonus: автоматические a11y тесты
  it('should pass accessibility tests', async () => {
    const result = render(/* same UI */);
    const a11yRunner = createA11yTestRunner(result);
    
    await a11yRunner.runAllTests(result.container);
  });
});
```

## 💡 Выгоды использования

### Для разработчиков
- **Меньше boilerplate кода** в тестах
- **Консистентность** тестов во всех компонентах
- **Автоматическая a11y проверка** без дополнительных усилий
- **Встроенный debug режим** для отладки тестов

### Для команды
- **Стандартизация** подходов к тестированию
- **Повышение качества** за счет автоматических проверок
- **Ускорение разработки** новых компонентов
- **Улучшение CI/CD** за счет performance мониторинга

### Для пользователей библиотеки
- **Более надежные компоненты** благодаря комплексному тестированию
- **Лучшая доступность** за счет автоматических a11y проверок
- **Стабильная производительность** благодаря performance тестам

## 🔄 Интеграция с существующим кодом

1. **Постепенная миграция** - можно мигрировать по одному компоненту
2. **Обратная совместимость** - работает с существующими @testing-library тестами
3. **Легкое внедрение** - минимальные изменения в существующих тестах

## 📊 Метрики и мониторинг

Библиотека автоматически собирает:
- **Время рендеринга** компонентов
- **Время обновления** при изменении пропсов
- **Использование памяти** 
- **Результаты a11y тестов**
- **Coverage headless-специфичных паттернов**

## 🎓 Обучение и принятие

- **Документация на русском языке** для вашей команды
- **Реальные примеры** с вашими компонентами
- **Пошаговое руководство** по интеграции
- **Best practices** для headless UI тестирования

---

Эта библиотека создана специально под архитектуру ваших headless компонентов и решает проблемы, специфичные для данного подхода к разработке UI.
