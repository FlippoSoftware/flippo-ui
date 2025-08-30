import type { HeadlessMatcherOptions } from '../types';

/**
 * Custom matcher definitions for TypeScript
 */
declare module 'vitest' {
  interface Assertion<T = any> {
    /**
     * Tests that an element has proper headless UI accessibility attributes
     */
    toHaveHeadlessUIAttributes(
      expectedAttributes?: Record<string, string | boolean | null>,
      options?: HeadlessMatcherOptions
    ): T;

    /**
     * Tests that an element is properly focused (including virtual focus)
     */
    toHaveHeadlessFocus(): T;

    /**
     * Tests that a compound component has all required parts
     */
    toHaveCompoundParts(expectedParts: string[]): T;

    /**
     * Tests that an element has proper event handler attributes
     */
    toHaveEventHandler(eventType: string): T;

    /**
     * Tests that an element prevents the default headless UI handler
     */
    toPreventHeadlessUIHandler(): T;

    /**
     * Tests that an element is properly positioned (for floating elements)
     */
    toBeProperlyPositioned(expectedPosition?: { top?: number; left?: number }): T;
  }

  interface AsymmetricMatchersContaining {
    /**
     * Tests that an element has proper headless UI accessibility attributes
     */
    toHaveHeadlessUIAttributes(
      expectedAttributes?: Record<string, string | boolean | null>,
      options?: HeadlessMatcherOptions
    ): any;

    /**
     * Tests that an element is properly focused (including virtual focus)
     */
    toHaveHeadlessFocus(): any;

    /**
     * Tests that a compound component has all required parts
     */
    toHaveCompoundParts(expectedParts: string[]): any;

    /**
     * Tests that an element has proper event handler attributes
     */
    toHaveEventHandler(eventType: string): any;

    /**
     * Tests that an element prevents the default headless UI handler
     */
    toPreventHeadlessUIHandler(): any;

    /**
     * Tests that an element is properly positioned (for floating elements)
     */
    toBeProperlyPositioned(expectedPosition?: { top?: number; left?: number }): any;
  }
}
