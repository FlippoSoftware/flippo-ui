/**
 * @flippo/internal-test-utils
 * 
 * Internal testing utilities for Flippo headless UI components.
 * Provides a comprehensive suite of tools for testing React components
 * with focus on headless UI patterns, accessibility, and performance.
 */

// Core renderer and utilities
export { createRenderer, defaultRenderer, rtlRenderer, performanceRenderer } from './renderer/createRenderer';

// Setup and initialization
export { init, quickSetup } from './setup';
export { setupVitest, setupCompoundComponentTesting, setupPerformanceTesting, setupDebugMode } from './setup/vitest';

// Testing utilities
export { HeadlessTestUtils, createHeadlessTestUtils, testCompoundComponent, testInteractionScenarios, testAsChildPattern } from './utils/headless';
export { AccessibilityTestRunner, createA11yTestRunner, testAccessibility, testKeyboardPatterns, KEYBOARD_PATTERNS } from './utils/accessibility';
export { PerformanceTestRunner, createPerformanceRunner, testComponentPerformance, testStressPerformance } from './utils/performance';
export { EventTestRunner, createEventTestRunner, testCommonEventPatterns, createMockHeadlessUIEvent, testEventHandlerMerging } from './utils/events';
export { CompoundComponentTester, createCompoundTester, testCompoundPatterns, testAriaRelationships, testStateSynchronization } from './utils/compound';

// Matchers and assertions
export { initMatchers, headlessMatchers, waitForPosition, waitForStateChange } from './matchers';

// Providers
export { DirectionProvider } from './renderer/providers/DirectionProvider';
export { PerformanceMonitor, PerformanceContext, usePerformanceMetrics } from './renderer/providers/PerformanceMonitor';
export { TestIdProvider, useTestId } from './renderer/providers/TestIdProvider';

// Types
export type {
  RendererOptions,
  HeadlessRenderResult,
  HeadlessMatcherOptions,
  CompoundTestConfig,
  InteractionScenario,
  A11yTestOptions,
  PerformanceThresholds,
  TestEnvironmentConfig,
} from './types';

// Re-export commonly used testing library utilities
export {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  act,
  cleanup,
} from '@testing-library/react';

export { userEvent } from '@testing-library/user-event';
export { vi, expect, describe, it, test, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

/**
 * Convenience function to create a complete test environment
 */
export function createTestEnvironment(config?: import('./types').TestEnvironmentConfig) {
  // Initialize environment
  const { init } = require('./setup');
  init(config);
  
  // Create renderer
  const { createRenderer } = require('./renderer/createRenderer');
  const renderer = createRenderer({
    direction: config?.defaultDirection,
    enablePerformanceMonitoring: config?.enablePerformanceMonitoring,
  });

  return {
    render: renderer.render,
    cleanup: renderer.cleanup,
  };
}

/**
 * Version information
 */
export const version = '1.0.0';
