import * as React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { expect } from 'vitest';

import type { HeadlessRenderResult, CompoundTestConfig, InteractionScenario } from '../types';
import { createRenderer } from '../renderer/createRenderer';

/**
 * Test utilities specific to Flippo headless components
 */
export class HeadlessTestUtils {
  private renderResult: HeadlessRenderResult;

  constructor(renderResult: HeadlessRenderResult) {
    this.renderResult = renderResult;
  }

  /**
   * Tests keyboard navigation for a component
   */
  async testKeyboardNavigation(config: {
    trigger: HTMLElement;
    expectedTarget?: HTMLElement;
    key: string;
    expectFocus?: boolean;
  }) {
    const { trigger, expectedTarget, key, expectFocus = true } = config;
    
    // Focus the trigger element
    fireEvent.focus(trigger);
    expect(trigger).toHaveFocus();
    
    // Perform keyboard action
    fireEvent.keyDown(trigger, { key });
    
    if (expectFocus && expectedTarget) {
      await waitFor(() => {
        expect(expectedTarget).toHaveFocus();
      });
    }
  }

  /**
   * Tests hover interactions for components like Tooltip
   */
  async testHoverInteraction(config: {
    trigger: HTMLElement;
    expectedContent: string | HTMLElement;
    shouldAppear?: boolean;
  }) {
    const { trigger, expectedContent, shouldAppear = true } = config;
    const { user } = this.renderResult;

    // Hover over trigger
    await user.hover(trigger);

    if (shouldAppear) {
      if (typeof expectedContent === 'string') {
        await waitFor(() => {
          expect(screen.getByText(expectedContent)).toBeInTheDocument();
        });
      } else {
        await waitFor(() => {
          expect(expectedContent).toBeInTheDocument();
        });
      }
    }

    // Unhover
    await user.unhover(trigger);

    if (shouldAppear) {
      await waitFor(() => {
        if (typeof expectedContent === 'string') {
          expect(screen.queryByText(expectedContent)).not.toBeInTheDocument();
        } else {
          expect(expectedContent).not.toBeInTheDocument();
        }
      });
    }
  }

  /**
   * Tests focus management for components
   */
  async testFocusInteraction(config: {
    trigger: HTMLElement;
    expectedContent?: string | HTMLElement;
    shouldOpen?: boolean;
  }) {
    const { trigger, expectedContent, shouldOpen = true } = config;

    // Focus trigger
    fireEvent.focus(trigger);

    if (shouldOpen && expectedContent) {
      await waitFor(() => {
        if (typeof expectedContent === 'string') {
          expect(screen.getByText(expectedContent)).toBeInTheDocument();
        } else {
          expect(expectedContent).toBeInTheDocument();
        }
      });
    }

    // Blur trigger
    fireEvent.blur(trigger);

    if (shouldOpen && expectedContent) {
      await waitFor(() => {
        if (typeof expectedContent === 'string') {
          expect(screen.queryByText(expectedContent)).not.toBeInTheDocument();
        } else {
          expect(expectedContent).not.toBeInTheDocument();
        }
      });
    }
  }

  /**
   * Tests that a component properly handles state changes
   */
  async testStateChange(config: {
    trigger: HTMLElement;
    action: () => Promise<void> | void;
    expectedStateChange: () => Promise<void> | void;
  }) {
    const { trigger, action, expectedStateChange } = config;

    await action();
    await expectedStateChange();
  }

  /**
   * Tests accessibility attributes on an element
   */
  testAccessibilityAttributes(element: HTMLElement, expectedAttributes: Record<string, string | null>) {
    Object.entries(expectedAttributes).forEach(([attribute, expectedValue]) => {
      if (expectedValue === null) {
        expect(element).not.toHaveAttribute(attribute);
      } else {
        expect(element).toHaveAttribute(attribute, expectedValue);
      }
    });
  }

  /**
   * Tests that event handlers are called with correct arguments
   */
  async testEventHandler(config: {
    element: HTMLElement;
    event: string;
    handler: ReturnType<typeof vi.fn>;
    expectedArgs?: any[];
    eventOptions?: any;
  }) {
    const { element, event, handler, expectedArgs, eventOptions } = config;
    
    handler.mockClear();
    
    if (event.startsWith('user.')) {
      // Handle user event
      const userAction = event.replace('user.', '');
      await (this.renderResult.user as any)[userAction](element, eventOptions);
    } else {
      // Handle fire event
      fireEvent[event as keyof typeof fireEvent](element, eventOptions);
    }

    expect(handler).toHaveBeenCalled();
    
    if (expectedArgs) {
      expect(handler).toHaveBeenCalledWith(...expectedArgs);
    }
  }
}

/**
 * Creates test utilities for headless components
 */
export function createHeadlessTestUtils(renderResult: HeadlessRenderResult): HeadlessTestUtils {
  return new HeadlessTestUtils(renderResult);
}

/**
 * Test a compound component structure (e.g., Dialog.Root, Dialog.Trigger, etc.)
 */
export function testCompoundComponent(config: CompoundTestConfig) {
  const { rootComponent, requiredChildren = [], provider: Provider } = config;

  return {
    /**
     * Test that the compound component renders correctly
     */
    testBasicRender: (ui: React.ReactElement) => {
      const { render } = createRenderer();
      
      if (Provider) {
        const result = render(React.createElement(Provider, { children: ui }));
        return createHeadlessTestUtils(result);
      }
      
      const result = render(ui);
      return createHeadlessTestUtils(result);
    },

    /**
     * Test that required children are present
     */
    testRequiredChildren: (ui: React.ReactElement) => {
      const { render } = createRenderer();
      const result = render(ui);
      
      requiredChildren.forEach(childName => {
        expect(result.container.querySelector(`[data-flippo-component="${childName}"]`))
          .toBeInTheDocument();
      });
      
      return createHeadlessTestUtils(result);
    },

    /**
     * Test error handling when required children are missing
     */
    testMissingChildrenError: (uiWithoutChildren: React.ReactElement) => {
      const { render } = createRenderer();
      
      expect(() => render(uiWithoutChildren)).toThrow();
    },
  };
}

/**
 * Run a series of interaction scenarios for a component
 */
export async function testInteractionScenarios(
  scenarios: InteractionScenario[],
  renderResult: HeadlessRenderResult
) {
  const utils = createHeadlessTestUtils(renderResult);
  
  for (const scenario of scenarios) {
    await scenario.setup(renderResult);
    await scenario.interact(renderResult);
    await scenario.assert(renderResult);
  }
}

/**
 * Test that a component properly implements the asChild pattern
 */
export function testAsChildPattern(config: {
  Component: React.ComponentType<any>;
  props?: Record<string, any>;
  asChildElement: React.ReactElement;
  expectedTag: string;
}) {
  const { Component, props = {}, asChildElement, expectedTag } = config;
  const { render } = createRenderer();

  // Test normal rendering
  const normalResult = render(React.createElement(Component, props, 'Content'));
  expect(normalResult.container.firstChild?.nodeName.toLowerCase()).not.toBe(expectedTag.toLowerCase());

  // Test asChild rendering
  const asChildResult = render(
    React.createElement(Component, { ...props, asChild: true }, asChildElement)
  );
  expect(asChildResult.container.firstChild?.nodeName.toLowerCase()).toBe(expectedTag.toLowerCase());
}
