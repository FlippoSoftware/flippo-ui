import { expect } from 'vitest';
import { waitFor } from '@testing-library/react';
import type { HeadlessMatcherOptions } from '../types';

/**
 * Custom matchers for Flippo headless components
 */
export const headlessMatchers = {
  /**
   * Tests that an element has proper headless UI accessibility attributes
   */
  toHaveHeadlessUIAttributes(
    received: HTMLElement, 
    expectedAttributes?: Record<string, string | boolean | null>,
    options: HeadlessMatcherOptions = {}
  ) {
    const { checkAccessibility = true, validateAria = true } = options;
    
    if (checkAccessibility) {
      // Check for basic accessibility requirements
      const hasAccessibleName = received.hasAttribute('aria-label') || 
                               received.hasAttribute('aria-labelledby') ||
                               received.textContent?.trim();
      
      if (!hasAccessibleName && received.tagName !== 'DIV') {
        return {
          message: () => `Expected element to have an accessible name (aria-label, aria-labelledby, or text content)`,
          pass: false,
        };
      }
    }

    if (validateAria && expectedAttributes) {
      const missingAttributes: string[] = [];
      const incorrectValues: string[] = [];

      Object.entries(expectedAttributes).forEach(([attr, expectedValue]) => {
        const actualValue = received.getAttribute(attr);
        
        if (expectedValue === null) {
          if (actualValue !== null) {
            incorrectValues.push(`${attr}: expected null, got "${actualValue}"`);
          }
        } else if (typeof expectedValue === 'boolean') {
          const boolValue = actualValue === 'true';
          if (boolValue !== expectedValue) {
            incorrectValues.push(`${attr}: expected ${expectedValue}, got ${boolValue}`);
          }
        } else if (actualValue !== expectedValue) {
          if (actualValue === null) {
            missingAttributes.push(attr);
          } else {
            incorrectValues.push(`${attr}: expected "${expectedValue}", got "${actualValue}"`);
          }
        }
      });

      if (missingAttributes.length > 0 || incorrectValues.length > 0) {
        const errors = [
          ...missingAttributes.map(attr => `Missing attribute: ${attr}`),
          ...incorrectValues,
        ];
        
        return {
          message: () => `Accessibility attributes mismatch:\n${errors.join('\n')}`,
          pass: false,
        };
      }
    }

    return {
      message: () => `Expected element to fail headless UI accessibility check`,
      pass: true,
    };
  },

  /**
   * Tests that an element is properly focused (including virtual focus)
   */
  toHaveHeadlessFocus(received: HTMLElement) {
    const hasDOMFocus = document.activeElement === received;
    const hasVirtualFocus = received.hasAttribute('data-focus') || 
                           received.hasAttribute('aria-current') ||
                           received.classList.contains('focus') ||
                           received.classList.contains('focused');

    const pass = hasDOMFocus || hasVirtualFocus;

    return {
      message: () => 
        pass 
          ? `Expected element not to have headless focus`
          : `Expected element to have headless focus (DOM focus or virtual focus indicators)`,
      pass,
    };
  },

  /**
   * Tests that a compound component has all required parts
   */
  toHaveCompoundParts(received: HTMLElement, expectedParts: string[]) {
    const missingParts: string[] = [];
    
    expectedParts.forEach(part => {
      const partSelector = `[data-flippo-component*="${part}"], [data-testid*="${part.toLowerCase()}"]`;
      const partElement = received.querySelector(partSelector);
      
      if (!partElement) {
        missingParts.push(part);
      }
    });

    const pass = missingParts.length === 0;

    return {
      message: () => 
        pass
          ? `Expected compound component not to have all required parts`
          : `Expected compound component to have parts: ${missingParts.join(', ')}`,
      pass,
    };
  },

  /**
   * Tests that an element has proper event handler attributes
   */
  toHaveEventHandler(received: HTMLElement, eventType: string) {
    const eventProp = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
    
    // Check if element has the event handler in its props
    const hasHandler = (received as any)[eventProp] || 
                      received.hasAttribute(`data-${eventType}`) ||
                      received.hasAttribute(`aria-${eventType}`);

    return {
      message: () => 
        hasHandler 
          ? `Expected element not to have ${eventType} event handler`
          : `Expected element to have ${eventType} event handler`,
      pass: Boolean(hasHandler),
    };
  },

  /**
   * Tests that an element prevents the default headless UI handler
   */
  toPreventHeadlessUIHandler(received: any) {
    const hasPreventMethod = typeof received?.preventHeadlessUIHandler === 'function';
    const isPrevented = received?.headlessUIHandlerPrevented === true;

    return {
      message: () => 
        hasPreventMethod && isPrevented
          ? `Expected event not to prevent headless UI handler`
          : `Expected event to prevent headless UI handler`,
      pass: hasPreventMethod && isPrevented,
    };
  },

  /**
   * Tests that an element is properly positioned (for floating elements)
   */
  toBeProperlyPositioned(received: HTMLElement, expectedPosition?: { top?: number; left?: number }) {
    const computedStyle = window.getComputedStyle(received);
    const position = computedStyle.position;
    
    const isPositioned = ['absolute', 'fixed', 'relative'].includes(position);
    
    if (!isPositioned) {
      return {
        message: () => `Expected element to be positioned (absolute, fixed, or relative), got ${position}`,
        pass: false,
      };
    }

    if (expectedPosition) {
      const rect = received.getBoundingClientRect();
      const { top, left } = expectedPosition;
      
      if (top !== undefined && Math.abs(rect.top - top) > 1) {
        return {
          message: () => `Expected element top position to be ${top}, got ${rect.top}`,
          pass: false,
        };
      }
      
      if (left !== undefined && Math.abs(rect.left - left) > 1) {
        return {
          message: () => `Expected element left position to be ${left}, got ${rect.left}`,
          pass: false,
        };
      }
    }

    return {
      message: () => `Expected element not to be properly positioned`,
      pass: true,
    };
  },
};

/**
 * Initialize custom matchers for Vitest
 */
export function initMatchers() {
  expect.extend(headlessMatchers);
}

/**
 * Helper function to wait for element to be positioned
 */
export async function waitForPosition(element: HTMLElement, timeout = 1000) {
  await waitFor(() => {
    expect(element).toBeProperlyPositioned();
  }, { timeout });
}

/**
 * Helper function to wait for component state changes
 */
export async function waitForStateChange(
  checkFunction: () => boolean | Promise<boolean>,
  timeout = 1000
) {
  await waitFor(async () => {
    const result = await checkFunction();
    expect(result).toBe(true);
  }, { timeout });
}
