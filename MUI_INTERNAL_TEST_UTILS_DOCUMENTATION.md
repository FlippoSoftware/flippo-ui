# @mui/internal-test-utils Documentation

## Overview

The `@mui/internal-test-utils` package is an internal utility library designed specifically for testing within the MUI (Material-UI) ecosystem. This package provides a comprehensive suite of functions and tools that standardize test runner initialization and offer common testing utilities shared across all MUI packages.

> **⚠️ Important Note**: This package is intended for internal MUI development use only and is not meant for general public consumption. It's designed to maintain consistency and efficiency across MUI's internal testing infrastructure.

## Table of Contents

1. [Installation](#installation)
2. [Core Functions](#core-functions)
3. [Test Environment Setup](#test-environment-setup)
4. [Testing Framework Configuration](#testing-framework-configuration)
5. [Custom Matchers and Assertions](#custom-matchers-and-assertions)
6. [Best Practices](#best-practices)
7. [Usage Examples](#usage-examples)

## Installation

```bash
npm install @mui/internal-test-utils --save-dev
# or
yarn add @mui/internal-test-utils --dev
# or
pnpm add @mui/internal-test-utils --save-dev
```

## Core Functions

### `createRenderer`

**Purpose**: Initializes the test suite and returns a function with the same interface as `render` from `@testing-library/react`, ensuring consistent rendering behavior across all tests.

**Type Signature**:
```typescript
function createRenderer(options?: RendererOptions): {
  render: (ui: ReactElement, options?: RenderOptions) => RenderResult;
  cleanup: () => void;
}
```

**Why it exists**: 
- Provides a standardized rendering function across all MUI tests
- Ensures consistent test environment setup
- Abstracts away common test setup boilerplate
- Handles cleanup automatically between tests

**Usage Example**:
```javascript
import { createRenderer } from '@mui/internal-test-utils';

describe('Button Component', () => {
  const { render } = createRenderer();

  it('should render with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).not.to.equal(null);
  });

  it('should handle click events', () => {
    const handleClick = spy();
    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(getByRole('button'));
    expect(handleClick.calledOnce).to.equal(true);
  });
});
```

**Key Features**:
- Automatic cleanup between tests
- Consistent theme provider setup
- Standardized error boundary handling
- Performance monitoring integration

### `createDescribe`

**Purpose**: Provides an enhanced wrapper around the standard `describe` function to facilitate creation of test suites with additional configurations, setups, or shared behaviors.

**Type Signature**:
```typescript
function createDescribe(
  name: string,
  options?: DescribeOptions
): (callback: () => void) => void
```

**Why it exists**:
- Standardizes test suite configuration across MUI packages
- Provides common setup and teardown logic
- Enables conditional test execution based on environment
- Reduces boilerplate code in test files

**Usage Example**:
```javascript
import { createDescribe } from '@mui/internal-test-utils';

const describe = createDescribe('Component Integration Tests', {
  theme: 'dark',
  viewport: 'mobile'
});

describe(() => {
  it('should work in dark theme', () => {
    // Test implementation
  });
});
```

## Test Environment Setup

### `init`

**Purpose**: Initializes the entire testing environment by setting up necessary configurations, global variables, and environmental conditions required for MUI testing.

**Type Signature**:
```typescript
function init(config?: InitConfig): void
```

**Why it exists**:
- Ensures consistent test environment across different test runners
- Sets up global polyfills and configurations
- Initializes performance monitoring
- Configures error handling for tests

**Usage Example**:
```javascript
import { init } from '@mui/internal-test-utils';

// In test setup file (e.g., setupTests.js)
init({
  enablePerformanceMonitoring: true,
  errorBoundary: true,
  theme: 'light'
});
```

### `setupJSDOM`

**Purpose**: Configures and initializes a JSDOM environment to simulate a browser-like environment within Node.js, enabling DOM interactions in tests without requiring a real browser.

**Type Signature**:
```typescript
function setupJSDOM(options?: JSDOMOptions): void
```

**Why it exists**:
- Enables DOM testing in Node.js environment
- Provides consistent DOM API across test runs
- Supports browser-specific APIs like `window`, `document`, etc.
- Faster than running tests in real browsers

**Features**:
- Configures global DOM objects (`window`, `document`, `navigator`)
- Sets up event handling
- Provides mock implementations for browser APIs
- Handles cleanup between test runs

**Usage Example**:
```javascript
import { setupJSDOM } from '@mui/internal-test-utils';

// In test setup file
setupJSDOM({
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable'
});
```

## Testing Framework Configuration

### `setupVitest`

**Purpose**: Configures the Vitest testing framework with MUI-specific settings, plugins, and optimizations for efficient test execution.

**Type Signature**:
```typescript
function setupVitest(config?: VitestConfig): void
```

**Why it exists**:
- Optimizes Vitest for MUI component testing
- Configures proper TypeScript handling
- Sets up mock providers and utilities
- Enables fast refresh and hot module replacement in tests

**Configuration Features**:
- Custom resolver for MUI packages
- TypeScript configuration
- Mock setup for external dependencies
- Performance optimizations

### `setupKarma`

**Purpose**: Configures the Karma test runner for executing tests across multiple browsers, ensuring cross-browser compatibility of MUI components.

**Type Signature**:
```typescript
function setupKarma(config?: KarmaConfig): void
```

**Why it exists**:
- Enables cross-browser testing
- Provides consistent test execution environment
- Integrates with CI/CD pipelines
- Supports headless browser testing

**Features**:
- Browser configuration (Chrome, Firefox, Safari)
- Webpack integration for module bundling
- Coverage reporting setup
- Performance monitoring

### `setupBabel` / `setupBabelPlaywright`

**Purpose**: Configures Babel transpilation for test environments, with specialized setup for different testing frameworks.

**Type Signatures**:
```typescript
function setupBabel(config?: BabelConfig): void
function setupBabelPlaywright(config?: BabelPlaywrightConfig): void
```

**Why they exist**:
- Ensure modern JavaScript features work in test environments
- Handle TypeScript transpilation
- Configure JSX transformation
- Support experimental features used in MUI

**Key Babel Configurations**:
- React JSX transformation
- TypeScript preset
- Dynamic imports support
- Emotion CSS-in-JS transformation

## Custom Matchers and Assertions

### `initMatchers`

**Purpose**: Registers custom Jest/Vitest matchers that extend assertion capabilities with MUI-specific testing utilities.

**Type Signature**:
```typescript
function initMatchers(): void
```

**Available Custom Matchers**:
- `toHaveVirtualFocus()` - Tests virtual focus state
- `toBeAccessible()` - Validates accessibility compliance
- `toHaveTheme()` - Checks theme application
- `toMatchComponentSnapshot()` - Component-specific snapshot testing

**Usage Example**:
```javascript
import { initMatchers } from '@mui/internal-test-utils';

// In test setup
initMatchers();

// In tests
expect(element).toHaveVirtualFocus();
expect(component).toBeAccessible();
expect(styledElement).toHaveTheme('primary');
```

### `initPlaywrightMatchers`

**Purpose**: Provides Playwright-specific custom matchers for enhanced end-to-end testing assertions.

**Type Signature**:
```typescript
function initPlaywrightMatchers(): void
```

**Playwright-Specific Matchers**:
- `toBeVisibleInViewport()` - Checks element visibility
- `toHaveCorrectColors()` - Validates color scheme application
- `toPassAccessibilityAudit()` - Runs automated accessibility checks
- `toHaveCorrectFocus()` - Validates focus management

### `chaiPlugin`

**Purpose**: Extends the Chai assertion library with MUI-specific plugins and assertions.

**Type Signature**:
```typescript
function chaiPlugin(chai: ChaiStatic, utils: ChaiUtils): void
```

**Custom Chai Assertions**:
- Component state validation
- Theme consistency checks
- Accessibility compliance verification
- Performance threshold validation

## Testing Framework Utilities

### `describeSkipIf`

**Purpose**: Provides conditional test execution, allowing test suites to be dynamically skipped based on runtime conditions or environment variables.

**Type Signature**:
```typescript
function describeSkipIf(
  condition: boolean | (() => boolean),
  suiteName: string,
  suiteCallback: () => void
): void
```

**Why it exists**:
- Handles environment-specific testing (browser support, feature flags)
- Enables progressive testing rollouts
- Supports conditional CI/CD testing
- Prevents flaky tests in unsupported environments

**Usage Example**:
```javascript
import { describeSkipIf } from '@mui/internal-test-utils';

// Skip tests in environments that don't support certain features
describeSkipIf(
  !('ResizeObserver' in window),
  'Responsive Component Tests',
  () => {
    it('should resize correctly', () => {
      // Test implementation
    });
  }
);

// Skip based on environment variable
describeSkipIf(
  process.env.SKIP_SLOW_TESTS === 'true',
  'Performance Tests',
  () => {
    it('should render within performance threshold', () => {
      // Slow test implementation
    });
  }
);
```

### `KarmaReporterReactProfiler`

**Purpose**: Custom Karma reporter that integrates with React Profiler to collect and report performance metrics during test execution.

**Type Signature**:
```typescript
class KarmaReporterReactProfiler {
  constructor(baseReporterDecorator: Function, config: KarmaConfig);
  onRunStart(): void;
  onBrowserStart(browser: Browser): void;
  onSpecComplete(browser: Browser, result: TestResult): void;
  onRunComplete(): void;
}
```

**Why it exists**:
- Monitors component performance during testing
- Identifies performance regressions early
- Provides detailed timing information
- Integrates performance testing into CI/CD

**Performance Metrics Collected**:
- Component render time
- Update performance
- Memory usage patterns
- Bundle size impact

## Advanced Configuration

### Environment-Specific Setup

The package provides different setup functions for various testing environments:

```javascript
// For Jest/Vitest environment
import { setupJSDOM, initMatchers } from '@mui/internal-test-utils';

setupJSDOM();
initMatchers();

// For Playwright environment
import { setupBabelPlaywright, initPlaywrightMatchers } from '@mui/internal-test-utils';

setupBabelPlaywright();
initPlaywrightMatchers();

// For Karma environment
import { setupKarma, setupBabel } from '@mui/internal-test-utils';

setupKarma({
  browsers: ['Chrome', 'Firefox'],
  singleRun: true
});
setupBabel();
```

## Best Practices

### 1. Test Suite Organization

```javascript
import { createRenderer, createDescribe } from '@mui/internal-test-utils';

const describe = createDescribe('Component Test Suite');

describe(() => {
  const { render } = createRenderer();
  
  beforeEach(() => {
    // Common setup
  });

  it('should pass accessibility tests', () => {
    const { container } = render(<MyComponent />);
    expect(container.firstChild).toBeAccessible();
  });
});
```

### 2. Performance Testing Integration

```javascript
import { createRenderer, KarmaReporterReactProfiler } from '@mui/internal-test-utils';

describe('Performance Tests', () => {
  const { render } = createRenderer({ 
    enableProfiling: true 
  });

  it('should render within performance threshold', () => {
    const start = performance.now();
    render(<ExpensiveComponent />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100); // 100ms threshold
  });
});
```

### 3. Cross-Framework Testing

```javascript
// Conditional setup based on test runner
import { 
  setupVitest, 
  setupKarma, 
  describeSkipIf 
} from '@mui/internal-test-utils';

if (typeof vitest !== 'undefined') {
  setupVitest();
} else {
  setupKarma();
}

// Skip tests based on capabilities
describeSkipIf(
  typeof IntersectionObserver === 'undefined',
  'Intersection Observer Tests',
  () => {
    // Tests that require IntersectionObserver
  }
);
```

## Common Usage Patterns

### Complete Test Setup

```javascript
import {
  createRenderer,
  init,
  initMatchers,
  setupJSDOM
} from '@mui/internal-test-utils';

// Initialize testing environment
init({
  enablePerformanceMonitoring: true,
  errorBoundary: true
});

setupJSDOM({
  url: 'http://localhost:3000',
  pretendToBeVisual: true
});

initMatchers();

// Create renderer for test suite
const { render } = createRenderer();

describe('Component Integration Tests', () => {
  it('should integrate properly with theme', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <MyComponent color="primary" />
      </ThemeProvider>
    );
    
    expect(container.firstChild).toHaveTheme('primary');
  });
});
```

### Playwright E2E Testing Setup

```javascript
import {
  setupBabelPlaywright,
  initPlaywrightMatchers,
  describeSkipIf
} from '@mui/internal-test-utils';

// Setup for Playwright
setupBabelPlaywright({
  targets: { node: 'current' },
  modules: false
});

initPlaywrightMatchers();

describeSkipIf(
  process.env.CI && process.env.BROWSER === 'webkit',
  'Safari-specific tests',
  () => {
    test('should handle touch interactions', async ({ page }) => {
      await page.goto('/button-demo');
      
      const button = page.locator('[data-testid="touch-button"]');
      await expect(button).toBeVisibleInViewport();
      await expect(button).toPassAccessibilityAudit();
    });
  }
);
```

## Architecture and Design Principles

### Consistency
The package ensures that all MUI packages follow the same testing patterns and configurations, reducing cognitive load for developers and maintaining quality standards.

### Performance
Built-in performance monitoring and optimization features help identify performance regressions early in the development cycle.

### Accessibility
Integrated accessibility testing ensures that MUI components meet accessibility standards out of the box.

### Cross-Platform Compatibility
Provides utilities to handle testing across different browsers, devices, and environments consistently.

## Function Reference Summary

| Function | Purpose | Primary Use Case |
|----------|---------|------------------|
| `createRenderer` | Standardized React component rendering | Unit/Integration tests |
| `createDescribe` | Enhanced test suite creation | Test organization |
| `init` | Global test environment initialization | Test setup |
| `setupJSDOM` | DOM environment simulation | Node.js testing |
| `setupVitest` | Vitest framework configuration | Modern test runner setup |
| `setupKarma` | Karma test runner configuration | Cross-browser testing |
| `setupBabel` | Babel transpilation setup | Code transformation |
| `setupBabelPlaywright` | Playwright-specific Babel config | E2E testing |
| `initMatchers` | Custom assertion registration | Enhanced testing assertions |
| `initPlaywrightMatchers` | Playwright assertion extensions | E2E testing assertions |
| `chaiPlugin` | Chai assertion extensions | Chai-based testing |
| `describeSkipIf` | Conditional test execution | Environment-specific testing |
| `KarmaReporterReactProfiler` | Performance monitoring | Performance testing |

## Integration with MUI Ecosystem

The `@mui/internal-test-utils` package is deeply integrated with the MUI ecosystem:

- **Theme Testing**: Provides utilities to test components across different MUI themes
- **Component API Testing**: Offers standardized ways to test component props and behaviors
- **Accessibility Testing**: Built-in accessibility validation for all MUI components
- **Performance Monitoring**: Tracks component performance across the entire library
- **Cross-Package Consistency**: Ensures testing patterns are consistent across all MUI packages

## Migration and Compatibility

The package is designed to be backward-compatible while providing migration paths for newer testing approaches:

- Gradual migration from Jest to Vitest
- Transition from Karma to modern test runners
- Support for both legacy and modern React testing patterns
- Compatibility with different TypeScript configurations

## Troubleshooting

### Common Issues

1. **JSDOM Environment Issues**: Use `setupJSDOM()` before running DOM-dependent tests
2. **Custom Matcher Not Found**: Ensure `initMatchers()` is called in test setup
3. **Babel Transpilation Errors**: Check that appropriate `setupBabel*` function is used
4. **Performance Test Failures**: Verify `KarmaReporterReactProfiler` is properly configured

### Debug Mode

```javascript
import { init } from '@mui/internal-test-utils';

init({
  debug: true, // Enables verbose logging
  enablePerformanceMonitoring: true,
  logLevel: 'debug'
});
```

## Contributing Guidelines

When working with `@mui/internal-test-utils`:

1. **Follow Established Patterns**: Use existing utilities rather than creating new ones
2. **Maintain Backward Compatibility**: Ensure changes don't break existing tests
3. **Document New Features**: Add comprehensive documentation for new utilities
4. **Performance Considerations**: Monitor the impact of changes on test execution time
5. **Cross-Platform Testing**: Verify utilities work across all supported environments

---

This package represents a crucial component of MUI's testing infrastructure, enabling consistent, reliable, and efficient testing across the entire ecosystem. Its utilities abstract away complex setup requirements while providing powerful testing capabilities tailored specifically for React component libraries.
