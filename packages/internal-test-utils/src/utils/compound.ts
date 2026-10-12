import * as React from 'react';
import { waitFor } from '@testing-library/react';
import { expect } from 'vitest';

import type { HeadlessRenderResult, CompoundTestConfig } from '../types';
import { createRenderer } from '../renderer/createRenderer';
import { createHeadlessTestUtils } from './headless';

/**
 * Testing utilities specifically designed for compound components
 * (components that consist of multiple parts like Dialog.Root, Dialog.Trigger, etc.)
 */
export class CompoundComponentTester {
  private config: CompoundTestConfig;

  constructor(config: CompoundTestConfig) {
    this.config = config;
  }

  /**
   * Test that all compound parts are properly connected
   */
  async testPartConnections(ui: React.ReactElement): Promise<HeadlessRenderResult> {
    const { render } = createRenderer();
    const Provider = this.config.provider;

    const result = Provider 
      ? render(React.createElement(Provider, { children: ui }))
      : render(ui);

    // Check that all required children are present
    if (this.config.requiredChildren) {
      this.config.requiredChildren.forEach(childName => {
        const childElement = result.container.querySelector(
          `[data-flippo-component*="${childName}"], [data-testid*="${childName.toLowerCase()}"]`
        );
        
        expect(childElement, `${childName} component should be rendered`).toBeInTheDocument();
      });
    }

    return result;
  }

  /**
   * Test that compound component handles context properly
   */
  testContextIntegration(ui: React.ReactElement) {
    const { render } = createRenderer();
    
    // Test with provider
    if (this.config.provider) {
      expect(() => {
        render(React.createElement(this.config.provider!, { children: ui }));
      }).not.toThrow();
    }

    // Test without provider (should work or throw meaningful error)
    try {
      render(ui);
    } catch (error) {
      // If it throws, it should be a meaningful error about missing context
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('context');
    }
  }

  /**
   * Test data flow between compound parts
   */
  async testDataFlow(config: {
    ui: React.ReactElement;
    triggerAction: (utils: HeadlessRenderResult) => Promise<void>;
    expectedStateChange: (utils: HeadlessRenderResult) => Promise<void>;
  }) {
    const result = await this.testPartConnections(config.ui);
    const utils = createHeadlessTestUtils(result);

    await config.triggerAction(result);
    await config.expectedStateChange(result);
  }

  /**
   * Test that compound component handles errors gracefully
   */
  testErrorHandling(scenarios: Array<{
    name: string;
    ui: React.ReactElement;
    expectedError?: string | RegExp;
  }>) {
    scenarios.forEach(({ name, ui, expectedError }) => {
      if (expectedError) {
        expect(() => {
          const { render } = createRenderer();
          render(ui);
        }, `${name} should throw error`).toThrow(expectedError);
      } else {
        expect(() => {
          const { render } = createRenderer();
          render(ui);
        }, `${name} should not throw error`).not.toThrow();
      }
    });
  }
}

/**
 * Create compound component tester
 */
export function createCompoundTester(config: CompoundTestConfig): CompoundComponentTester {
  return new CompoundComponentTester(config);
}

/**
 * Utility to test common compound component patterns
 */
export function testCompoundPatterns() {
  return {
    /**
     * Test Dialog compound pattern
     */
    dialog: createCompoundTester({
      rootComponent: 'Dialog',
      requiredChildren: ['DialogTrigger', 'DialogPopup'],
      provider: ({ children }) => React.createElement('div', { 'data-dialog-provider': true }, children),
    }),

    /**
     * Test Menu compound pattern
     */
    menu: createCompoundTester({
      rootComponent: 'Menu',
      requiredChildren: ['MenuTrigger', 'MenuPopup', 'MenuItem'],
    }),

    /**
     * Test Tooltip compound pattern
     */
    tooltip: createCompoundTester({
      rootComponent: 'Tooltip',
      requiredChildren: ['TooltipTrigger', 'TooltipPopup'],
    }),

    /**
     * Test Accordion compound pattern
     */
    accordion: createCompoundTester({
      rootComponent: 'Accordion',
      requiredChildren: ['AccordionItem', 'AccordionTrigger', 'AccordionContent'],
    }),

    /**
     * Test Tabs compound pattern
     */
    tabs: createCompoundTester({
      rootComponent: 'Tabs',
      requiredChildren: ['TabsList', 'Tab', 'TabsContent'],
    }),
  };
}

/**
 * Test that compound component maintains proper ARIA relationships
 */
export async function testAriaRelationships(config: {
  renderResult: HeadlessRenderResult;
  relationships: Array<{
    source: string; // selector or test id
    target: string; // selector or test id  
    attribute: string; // aria-labelledby, aria-describedby, etc.
  }>;
}) {
  const { renderResult, relationships } = config;

  for (const relationship of relationships) {
    const sourceElement = renderResult.getByTestId(relationship.source) || 
                         renderResult.container.querySelector(relationship.source);
    const targetElement = renderResult.getByTestId(relationship.target) ||
                         renderResult.container.querySelector(relationship.target);

    expect(sourceElement, `Source element ${relationship.source} should exist`).toBeInTheDocument();
    expect(targetElement, `Target element ${relationship.target} should exist`).toBeInTheDocument();

    const ariaValue = sourceElement?.getAttribute(relationship.attribute);
    const targetId = targetElement?.getAttribute('id');

    expect(
      ariaValue?.includes(targetId || ''), 
      `${relationship.attribute} should reference target element ID`
    ).toBe(true);
  }
}

/**
 * Test compound component state synchronization
 */
export async function testStateSynchronization(config: {
  renderResult: HeadlessRenderResult;
  stateChanges: Array<{
    action: () => Promise<void> | void;
    expectedStates: Array<{
      element: string; // selector or test id
      attribute: string;
      value: string | boolean;
    }>;
  }>;
}) {
  const { renderResult, stateChanges } = config;

  for (const change of stateChanges) {
    await change.action();

    for (const expectedState of change.expectedStates) {
      const element = renderResult.getByTestId(expectedState.element) ||
                     renderResult.container.querySelector(expectedState.element);

      expect(element, `Element ${expectedState.element} should exist`).toBeInTheDocument();

      if (typeof expectedState.value === 'boolean') {
        expect(element).toHaveAttribute(expectedState.attribute, String(expectedState.value));
      } else {
        expect(element).toHaveAttribute(expectedState.attribute, expectedState.value);
      }
    }
  }
}
