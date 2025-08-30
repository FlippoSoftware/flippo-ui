import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

import type { A11yTestOptions, HeadlessRenderResult } from '../types';

/**
 * Comprehensive accessibility testing utilities for headless components
 */
export class AccessibilityTestRunner {
  private renderResult: HeadlessRenderResult;
  private options: Required<A11yTestOptions>;

  constructor(renderResult: HeadlessRenderResult, options: A11yTestOptions = {}) {
    this.renderResult = renderResult;
    this.options = {
      keyboardNavigation: true,
      screenReader: true,
      focusManagement: true,
      colorContrast: false,
      customAriaRules: [],
      ...options,
    };
  }

  /**
   * Run all accessibility tests based on configuration
   */
  async runAllTests(element: HTMLElement) {
    const results: Array<{ test: string; passed: boolean; error?: string }> = [];

    if (this.options.keyboardNavigation) {
      try {
        await this.testKeyboardNavigation(element);
        results.push({ test: 'Keyboard Navigation', passed: true });
      } catch (error) {
        results.push({ 
          test: 'Keyboard Navigation', 
          passed: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    if (this.options.screenReader) {
      try {
        this.testScreenReaderSupport(element);
        results.push({ test: 'Screen Reader Support', passed: true });
      } catch (error) {
        results.push({ 
          test: 'Screen Reader Support', 
          passed: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    if (this.options.focusManagement) {
      try {
        await this.testFocusManagement(element);
        results.push({ test: 'Focus Management', passed: true });
      } catch (error) {
        results.push({ 
          test: 'Focus Management', 
          passed: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    if (this.options.customAriaRules.length > 0) {
      try {
        this.testCustomAriaRules(element);
        results.push({ test: 'Custom ARIA Rules', passed: true });
      } catch (error) {
        results.push({ 
          test: 'Custom ARIA Rules', 
          passed: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return results;
  }

  /**
   * Test keyboard navigation capabilities
   */
  async testKeyboardNavigation(element: HTMLElement) {
    const isInteractive = element.tabIndex >= 0 || 
                         ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase()) ||
                         element.getAttribute('role') === 'button';

    if (!isInteractive) {
      return; // Skip keyboard test for non-interactive elements
    }

    // Test Tab navigation
    fireEvent.focus(element);
    expect(element).toHaveFocus();

    // Test Enter key
    fireEvent.keyDown(element, { key: 'Enter' });
    
    // Test Space key for button-like elements
    if (element.getAttribute('role') === 'button' || element.tagName === 'BUTTON') {
      fireEvent.keyDown(element, { key: ' ' });
    }

    // Test Escape key
    fireEvent.keyDown(element, { key: 'Escape' });
  }

  /**
   * Test screen reader support through ARIA attributes
   */
  testScreenReaderSupport(element: HTMLElement) {
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    const ariaDescribedby = element.getAttribute('aria-describedby');

    // Check for accessible name
    const hasAccessibleName = ariaLabel || 
                             ariaLabelledby || 
                             element.textContent?.trim();

    if (!hasAccessibleName && element.tagName !== 'DIV') {
      throw new Error('Element must have an accessible name for screen readers');
    }

    // Check role consistency
    if (role) {
      this.validateAriaRole(element, role);
    }

    // Check ARIA relationships
    if (ariaLabelledby) {
      this.validateAriaRelationship(element, 'aria-labelledby', ariaLabelledby);
    }

    if (ariaDescribedby) {
      this.validateAriaRelationship(element, 'aria-describedby', ariaDescribedby);
    }
  }

  /**
   * Test focus management capabilities
   */
  async testFocusManagement(element: HTMLElement) {
    // Test initial focus
    element.focus();
    await waitFor(() => {
      expect(element).toHaveFocus();
    });

    // Test focus loss
    element.blur();
    expect(element).not.toHaveFocus();

    // Test programmatic focus
    fireEvent.focus(element);
    expect(element).toHaveFocus();
  }

  /**
   * Test custom ARIA rules
   */
  testCustomAriaRules(element: HTMLElement) {
    this.options.customAriaRules.forEach(rule => {
      const [attribute, expectedValue] = rule.split('=');
      const actualValue = element.getAttribute(attribute);
      
      if (expectedValue) {
        expect(actualValue).toBe(expectedValue);
      } else {
        expect(element).toHaveAttribute(attribute);
      }
    });
  }

  /**
   * Validate ARIA role consistency
   */
  private validateAriaRole(element: HTMLElement, role: string) {
    const validRoles = [
      'button', 'link', 'textbox', 'checkbox', 'radio', 'slider', 'spinbutton',
      'combobox', 'listbox', 'option', 'menu', 'menuitem', 'menubar', 'tab', 'tablist', 'tabpanel',
      'dialog', 'alertdialog', 'tooltip', 'status', 'alert', 'region', 'group'
    ];

    if (!validRoles.includes(role)) {
      console.warn(`Non-standard ARIA role detected: ${role}`);
    }

    // Role-specific validation
    switch (role) {
      case 'button':
        // Buttons should be keyboard accessible
        if (element.tabIndex < 0) {
          throw new Error('Button role elements should be keyboard accessible (tabIndex >= 0)');
        }
        break;
      
      case 'combobox':
        // Combobox should have aria-expanded
        if (!element.hasAttribute('aria-expanded')) {
          throw new Error('Combobox role elements should have aria-expanded attribute');
        }
        break;

      case 'slider':
        // Slider should have aria-valuenow, aria-valuemin, aria-valuemax
        const requiredSliderAttrs = ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'];
        requiredSliderAttrs.forEach(attr => {
          if (!element.hasAttribute(attr)) {
            throw new Error(`Slider role elements should have ${attr} attribute`);
          }
        });
        break;
    }
  }

  /**
   * Validate ARIA relationship attributes
   */
  private validateAriaRelationship(element: HTMLElement, attribute: string, value: string) {
    const referencedIds = value.split(' ').filter(id => id.trim());
    
    referencedIds.forEach(id => {
      const referencedElement = this.renderResult.container.querySelector(`#${id}`);
      if (!referencedElement) {
        throw new Error(`Referenced element with id "${id}" not found for ${attribute}`);
      }
    });
  }
}

/**
 * Create accessibility test runner for a rendered component
 */
export function createA11yTestRunner(
  renderResult: HeadlessRenderResult, 
  options?: A11yTestOptions
): AccessibilityTestRunner {
  return new AccessibilityTestRunner(renderResult, options);
}

/**
 * Quick accessibility test for an element with default options
 */
export async function testAccessibility(
  element: HTMLElement, 
  renderResult: HeadlessRenderResult,
  options?: A11yTestOptions
) {
  const runner = createA11yTestRunner(renderResult, options);
  const results = await runner.runAllTests(element);
  
  const failedTests = results.filter(result => !result.passed);
  if (failedTests.length > 0) {
    const errorMessage = failedTests
      .map(test => `${test.test}: ${test.error}`)
      .join('\n');
    throw new Error(`Accessibility tests failed:\n${errorMessage}`);
  }
  
  return results;
}

/**
 * Test keyboard navigation patterns common in headless components
 */
export async function testKeyboardPatterns(
  element: HTMLElement,
  patterns: Array<{
    name: string;
    keys: string[];
    expectedBehavior: (element: HTMLElement) => Promise<void> | void;
  }>
) {
  for (const pattern of patterns) {
    fireEvent.focus(element);
    
    for (const key of pattern.keys) {
      fireEvent.keyDown(element, { key });
    }
    
    await pattern.expectedBehavior(element);
  }
}

/**
 * Common keyboard patterns for different component types
 */
export const KEYBOARD_PATTERNS = {
  /**
   * Standard button keyboard patterns
   */
  BUTTON: [
    {
      name: 'Enter activation',
      keys: ['Enter'],
      expectedBehavior: async (element: HTMLElement) => {
        // Should trigger click or onChange
        expect(element).toHaveAttribute('aria-pressed');
      },
    },
    {
      name: 'Space activation', 
      keys: [' '],
      expectedBehavior: async (element: HTMLElement) => {
        // Should trigger click or onChange
        expect(element).toHaveAttribute('aria-pressed');
      },
    },
  ],

  /**
   * Navigation patterns for menus and lists
   */
  MENU: [
    {
      name: 'Arrow down navigation',
      keys: ['ArrowDown'],
      expectedBehavior: async (element: HTMLElement) => {
        // Should move to next item
        const nextItem = element.querySelector('[aria-selected="true"], [data-focus="true"]');
        expect(nextItem).toBeInTheDocument();
      },
    },
    {
      name: 'Arrow up navigation',
      keys: ['ArrowUp'],
      expectedBehavior: async (element: HTMLElement) => {
        // Should move to previous item
        const prevItem = element.querySelector('[aria-selected="true"], [data-focus="true"]');
        expect(prevItem).toBeInTheDocument();
      },
    },
    {
      name: 'Escape to close',
      keys: ['Escape'],
      expectedBehavior: async (element: HTMLElement) => {
        // Menu should close
        await waitFor(() => {
          expect(element).toHaveAttribute('aria-expanded', 'false');
        });
      },
    },
  ],

  /**
   * Tab navigation patterns
   */
  TABS: [
    {
      name: 'Arrow key navigation',
      keys: ['ArrowRight'],
      expectedBehavior: async (element: HTMLElement) => {
        const selectedTab = element.querySelector('[aria-selected="true"]');
        expect(selectedTab).toBeInTheDocument();
      },
    },
  ],

  /**
   * Dialog keyboard patterns
   */
  DIALOG: [
    {
      name: 'Escape to close',
      keys: ['Escape'],
      expectedBehavior: async (element: HTMLElement) => {
        await waitFor(() => {
          expect(element).not.toBeInTheDocument();
        });
      },
    },
  ],
} as const;
