import type * as React from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

/**
 * Configuration options for the test renderer
 */
export interface RendererOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom wrapper component for testing (e.g., providers, contexts)
   */
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  
  /**
   * Whether to enable automatic cleanup between tests
   * @default true
   */
  autoCleanup?: boolean;
  
  /**
   * Whether to enable performance monitoring during tests
   * @default false
   */
  enablePerformanceMonitoring?: boolean;
  
  /**
   * Direction for RTL testing
   * @default 'ltr'
   */
  direction?: 'ltr' | 'rtl';
}

/**
 * Enhanced render result with additional utilities for headless components
 */
export interface HeadlessRenderResult extends RenderResult {
  /**
   * User event instance configured for the test
   */
  user: UserEvent;
  
  /**
   * Enhanced getByTestId with better error messages
   */
  getByTestIdEnhanced: (id: string) => HTMLElement;
  
  /**
   * Enhanced queryByTestId
   */
  queryByTestIdEnhanced: (id: string) => HTMLElement | null;
  
  /**
   * Enhanced findByTestId
   */
  findByTestIdEnhanced: (id: string) => Promise<HTMLElement>;
}

/**
 * Custom matcher options for headless components
 */
export interface HeadlessMatcherOptions {
  /**
   * Whether to check for accessibility attributes
   * @default true
   */
  checkAccessibility?: boolean;
  
  /**
   * Whether to validate ARIA attributes
   * @default true
   */
  validateAria?: boolean;
  
  /**
   * Custom timeout for async operations
   * @default 1000
   */
  timeout?: number;
}

/**
 * Configuration for component compound testing
 */
export interface CompoundTestConfig {
  /**
   * Root component name for error messages
   */
  rootComponent: string;
  
  /**
   * Required child components for the compound component
   */
  requiredChildren?: string[];
  
  /**
   * Optional provider component that wraps the compound component
   */
  provider?: React.ComponentType<{ children: React.ReactNode }>;
}

/**
 * Test scenario for interaction testing
 */
export interface InteractionScenario {
  /**
   * Name of the interaction scenario
   */
  name: string;
  
  /**
   * Setup function to prepare the test environment
   */
  setup: (utils: HeadlessRenderResult) => Promise<void> | void;
  
  /**
   * The actual interaction to perform
   */
  interact: (utils: HeadlessRenderResult) => Promise<void> | void;
  
  /**
   * Assertions to verify the outcome
   */
  assert: (utils: HeadlessRenderResult) => Promise<void> | void;
}

/**
 * Configuration for accessibility testing
 */
export interface A11yTestOptions {
  /**
   * Whether to test keyboard navigation
   * @default true
   */
  keyboardNavigation?: boolean;
  
  /**
   * Whether to test screen reader compatibility
   * @default true
   */
  screenReader?: boolean;
  
  /**
   * Whether to test focus management
   * @default true
   */
  focusManagement?: boolean;
  
  /**
   * Whether to test color contrast
   * @default false
   */
  colorContrast?: boolean;
  
  /**
   * Custom ARIA rules to validate
   */
  customAriaRules?: string[];
}

/**
 * Performance testing thresholds
 */
export interface PerformanceThresholds {
  /**
   * Maximum render time in milliseconds
   * @default 100
   */
  maxRenderTime?: number;
  
  /**
   * Maximum update time in milliseconds  
   * @default 50
   */
  maxUpdateTime?: number;
  
  /**
   * Maximum memory usage in MB
   * @default 10
   */
  maxMemoryUsage?: number;
}

/**
 * Global test environment configuration
 */
export interface TestEnvironmentConfig {
  /**
   * Whether to enable global performance monitoring
   * @default false
   */
  enablePerformanceMonitoring?: boolean;
  
  /**
   * Whether to enable accessibility testing by default
   * @default true
   */
  enableA11yTesting?: boolean;
  
  /**
   * Default direction for components
   * @default 'ltr'
   */
  defaultDirection?: 'ltr' | 'rtl';
  
  /**
   * Whether to enable debug mode
   * @default false
   */
  debug?: boolean;
  
  /**
   * Custom matchers to register globally
   */
  customMatchers?: string[];
  
  /**
   * Performance thresholds for all tests
   */
  performanceThresholds?: PerformanceThresholds;
}
