/**
 * Main setup module for @flippo/internal-test-utils
 * 
 * This module provides a one-stop setup for all Flippo headless component testing needs.
 */

import { setupVitest, setupCompoundComponentTesting, setupPerformanceTesting, setupDebugMode } from './vitest';
import { initMatchers } from '../matchers';

import type { TestEnvironmentConfig } from '../types';

/**
 * Initialize complete testing environment for Flippo headless components
 */
export function init(config: TestEnvironmentConfig = {}) {
  // Setup base Vitest environment
  setupVitest(config);

  // Setup compound component testing if needed
  if (config.enableA11yTesting) {
    setupCompoundComponentTesting();
  }

  // Setup performance testing if enabled
  if (config.enablePerformanceMonitoring) {
    setupPerformanceTesting(config.performanceThresholds);
  }

  // Setup debug mode if enabled
  if (config.debug) {
    setupDebugMode();
  }

  // Initialize custom matchers
  initMatchers();

  // Register any custom matchers provided in config
  if (config.customMatchers && config.customMatchers.length > 0) {
    console.log(`Registered ${config.customMatchers.length} custom matchers`);
  }
}

/**
 * Quick setup for different testing scenarios
 */
export const quickSetup = {
  /**
   * Basic setup for unit testing
   */
  unit: () => init({
    enablePerformanceMonitoring: false,
    enableA11yTesting: true,
    debug: false,
  }),

  /**
   * Setup for integration testing
   */
  integration: () => init({
    enablePerformanceMonitoring: true,
    enableA11yTesting: true,
    debug: false,
  }),

  /**
   * Setup for performance testing
   */
  performance: () => init({
    enablePerformanceMonitoring: true,
    enableA11yTesting: false,
    debug: false,
    performanceThresholds: {
      maxRenderTime: 50,
      maxUpdateTime: 25,
      maxMemoryUsage: 5,
    },
  }),

  /**
   * Setup for accessibility testing
   */
  accessibility: () => init({
    enablePerformanceMonitoring: false,
    enableA11yTesting: true,
    debug: true,
  }),

  /**
   * Setup for debugging
   */
  debug: () => init({
    enablePerformanceMonitoring: true,
    enableA11yTesting: true,
    debug: true,
  }),
};

// Export setup functions
export {
  setupVitest,
  setupCompoundComponentTesting,
  setupPerformanceTesting,
  setupDebugMode,
};
