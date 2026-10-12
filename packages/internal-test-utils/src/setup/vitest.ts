import { vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import type { TestEnvironmentConfig } from '../types';
import { initMatchers } from '../matchers';

/**
 * Global test environment state
 */
let globalConfig: TestEnvironmentConfig = {};

/**
 * Setup Vitest environment for Flippo headless components testing
 */
export function setupVitest(config: TestEnvironmentConfig = {}) {
  globalConfig = {
    enablePerformanceMonitoring: false,
    enableA11yTesting: true,
    defaultDirection: 'ltr',
    debug: false,
    customMatchers: [],
    performanceThresholds: {
      maxRenderTime: 100,
      maxUpdateTime: 50,
      maxMemoryUsage: 10,
    },
    ...config,
  };

  // Initialize custom matchers
  initMatchers();

  // Setup global beforeEach hooks
  beforeEach(() => {
    // Mock performance.now if performance monitoring is enabled
    if (globalConfig.enablePerformanceMonitoring) {
      vi.spyOn(performance, 'now').mockReturnValue(Date.now());
    }

    // Setup fake timers for consistent timing tests
    vi.useFakeTimers();

    // Mock IntersectionObserver for components that use it
    global.IntersectionObserver = vi.fn().mockImplementation((callback, options) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }));

    // Mock ResizeObserver for responsive components
    global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock matchMedia for responsive testing
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock getComputedStyle for styling tests
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        getPropertyValue: () => '',
        position: 'static',
        top: '0px',
        left: '0px',
        width: '0px',
        height: '0px',
      }),
    });

    // Setup console spy for debug mode
    if (globalConfig.debug) {
      vi.spyOn(console, 'warn');
      vi.spyOn(console, 'error');
    }
  });

  // Setup global afterEach hooks
  afterEach(() => {
    // Restore real timers
    vi.useRealTimers();
    
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Reset document direction
    document.documentElement.dir = globalConfig.defaultDirection || 'ltr';

    // Check for console warnings/errors in debug mode
    if (globalConfig.debug) {
      const consoleWarn = console.warn as any;
      const consoleError = console.error as any;
      
      if (consoleWarn.mock?.calls.length > 0) {
        console.log('Console warnings during test:', consoleWarn.mock.calls);
      }
      
      if (consoleError.mock?.calls.length > 0) {
        console.log('Console errors during test:', consoleError.mock.calls);
      }
    }
  });
}

/**
 * Get current global test configuration
 */
export function getTestConfig(): TestEnvironmentConfig {
  return globalConfig;
}

/**
 * Update global test configuration
 */
export function updateTestConfig(config: Partial<TestEnvironmentConfig>) {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Setup specific configuration for compound component testing
 */
export function setupCompoundComponentTesting() {
  beforeEach(() => {
    // Add data attributes for compound component identification
    const style = document.createElement('style');
    style.textContent = `
      [data-flippo-component] {
        outline: 1px solid rgba(255, 0, 0, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
  });
}

/**
 * Setup performance testing configuration
 */
export function setupPerformanceTesting(thresholds?: TestEnvironmentConfig['performanceThresholds']) {
  updateTestConfig({
    enablePerformanceMonitoring: true,
    performanceThresholds: thresholds || globalConfig.performanceThresholds,
  });

  // Add performance observation helpers
  beforeEach(() => {
    // Create performance observer for component measurements
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > (globalConfig.performanceThresholds?.maxRenderTime || 100)) {
            console.warn(`Performance threshold exceeded: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  });
}

/**
 * Setup debugging helpers
 */
export function setupDebugMode() {
  updateTestConfig({ debug: true });
  
  // Add global debug helpers
  (global as any).debugElement = (element: HTMLElement) => {
    console.log('Element:', element);
    console.log('Attributes:', Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`));
    console.log('Computed style:', window.getComputedStyle(element));
    console.log('Event listeners:', (element as any).getEventListeners?.() || 'Not available');
  };

  (global as any).debugDOM = () => {
    console.log('Current DOM:', document.body.innerHTML);
  };
}
