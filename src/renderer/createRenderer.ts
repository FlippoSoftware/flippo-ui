import * as React from 'react';
import { render as testingLibraryRender, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import type { RendererOptions, HeadlessRenderResult } from '../types';
import { DirectionProvider } from './providers/DirectionProvider';
import { PerformanceMonitor } from './providers/PerformanceMonitor';
import { TestIdProvider } from './providers/TestIdProvider';
import { afterEach } from 'vitest';

/**
 * Creates a standardized renderer for Flippo headless components
 * 
 * @param options - Configuration options for the renderer
 * @returns Object with render function and cleanup utilities
 */
export function createRenderer(options: RendererOptions = {}) {
  const {
    wrapper: CustomWrapper,
    autoCleanup = true,
    enablePerformanceMonitoring = false,
    direction = 'ltr',
    ...renderOptions
  } = options;

  // Setup automatic cleanup if enabled
  if (autoCleanup) {
    afterEach(() => {
      cleanup();
    });
  }

  /**
   * Render a React component with Flippo headless UI providers
   */
  function render(ui: React.ReactElement, testOptions: Partial<RendererOptions> = {}): HeadlessRenderResult {
    const {
      wrapper: TestWrapper = React.Fragment,
      direction: testDirection = direction,
      enablePerformanceMonitoring: testPerformanceMonitoring = enablePerformanceMonitoring,
      ...testRenderOptions
    } = testOptions;

    // Create wrapper component with all necessary providers
    const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const wrappedChildren = CustomWrapper 
        ? React.createElement(CustomWrapper, { children })
        : children;

      const testWrapper = React.createElement(TestWrapper, { children: wrappedChildren });

      const content = testPerformanceMonitoring 
        ? React.createElement(PerformanceMonitor, { children: testWrapper })
        : testWrapper;

      const withTestId = React.createElement(TestIdProvider, { children: content });

      return React.createElement(
        DirectionProvider,
        { direction: testDirection, children: withTestId }
      );
    };

    const renderResult = testingLibraryRender(ui, {
      wrapper: AllProviders,
      ...renderOptions,
      ...testRenderOptions,
    });

    // Create user event instance
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
      pointerEventsCheck: 0, // Disable pointer events check for headless components
    });

    // Enhanced utilities for headless components
    const getByTestIdEnhanced = (id: string) => {
      const element = renderResult.queryByTestId(id);
      if (!element) {
        throw new Error(
          `Unable to find element with test id: ${id}\n\n` +
          `Available test ids:\n${
            Array.from(renderResult.container.querySelectorAll('[data-testid]'))
              .map(el => `  - ${el.getAttribute('data-testid')}`)
              .join('\n')
          }`
        );
      }
      return element;
    };

    const queryByTestIdEnhanced = (id: string) => renderResult.queryByTestId(id);
    
    const findByTestIdEnhanced = async (id: string) => {
      const element = await renderResult.findByTestId(id);
      if (!element) {
        throw new Error(`Unable to find element with test id: ${id}`);
      }
      return element;
    };

    return {
      ...renderResult,
      user,
      getByTestIdEnhanced,
      queryByTestIdEnhanced,
      findByTestIdEnhanced,
    };
  }

  return {
    render,
    cleanup,
  };
}

/**
 * Default renderer instance for simple use cases
 */
export const defaultRenderer = createRenderer();

/**
 * Renderer with RTL support enabled
 */
export const rtlRenderer = createRenderer({ direction: 'rtl' });

/**
 * Renderer with performance monitoring enabled
 */
export const performanceRenderer = createRenderer({ 
  enablePerformanceMonitoring: true 
});
