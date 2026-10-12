/**
 * Global setup file that can be imported in Vitest setupFiles
 */

import { init, quickSetup } from './index';

// Default initialization for most common use case
init({
  enableA11yTesting: true,
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
  debug: process.env.DEBUG_TESTS === 'true',
  defaultDirection: 'ltr',
});

// Export quick setups for different scenarios
export { quickSetup };
