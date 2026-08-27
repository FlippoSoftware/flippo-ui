/**
 * Example usage patterns for @flippo/internal-test-utils
 * 
 * These examples demonstrate how to use the testing utilities
 * with different types of headless components.
 */

import * as React from 'react';
import { vi } from 'vitest';

import { 
  createRenderer, 
  createHeadlessTestUtils, 
  testCompoundComponent,
  createA11yTestRunner,
  testComponentPerformance,
  KEYBOARD_PATTERNS,
  testCommonEventPatterns,
} from '../index';

/**
 * Example: Testing a simple Button component
 */
export const buttonExample = {
  // Mock Button component for example
  Component: ({ children, onClick, disabled, ...props }: any) => 
    React.createElement('button', { onClick, disabled, ...props }, children),

  async testBasicInteraction() {
    const { render } = createRenderer();
    const onClick = vi.fn();
    
    const result = render(
      <this.Component onClick={onClick}>
        Click me
      </this.Component>
    );

    const utils = createHeadlessTestUtils(result);
    const button = result.getByRole('button');

    // Test click interaction
    await utils.testEventHandler({
      element: button,
      event: 'user.click',
      handler: onClick,
    });

    // Test keyboard accessibility
    await utils.testKeyboardNavigation({
      trigger: button,
      key: 'Enter',
    });

    return result;
  },

  async testAccessibility() {
    const { render } = createRenderer();
    const result = render(<this.Component>Accessible Button</this.Component>);
    
    const button = result.getByRole('button');
    const a11yRunner = createA11yTestRunner(result);
    
    await a11yRunner.runAllTests(button);
  },

  async testPerformance() {
    await testComponentPerformance({
      Component: this.Component,
      props: { children: 'Performance Test' },
      thresholds: {
        maxRenderTime: 10, // Very fast for simple button
        maxUpdateTime: 5,
        maxMemoryUsage: 1,
      },
    });
  },
};

/**
 * Example: Testing a compound Tooltip component
 */
export const tooltipExample = {
  // Mock compound Tooltip components
  TooltipProvider: ({ children }: any) => React.createElement('div', { 'data-tooltip-provider': true }, children),
  TooltipRoot: ({ children, onOpenChange }: any) => React.createElement('div', { 'data-tooltip-root': true }, children),
  TooltipTrigger: ({ children, ...props }: any) => React.createElement('button', { ...props }, children),
  TooltipPortal: ({ children }: any) => React.createElement('div', { 'data-portal': true }, children),
  TooltipPositioner: ({ children }: any) => React.createElement('div', { 'data-positioner': true }, children),
  TooltipPopup: ({ children }: any) => React.createElement('div', { role: 'tooltip', ...props }, children),

  async testCompoundStructure() {
    const tooltipTester = testCompoundComponent({
      rootComponent: 'Tooltip',
      requiredChildren: ['TooltipTrigger', 'TooltipPopup'],
      provider: this.TooltipProvider,
    });

    const ui = (
      <this.TooltipRoot>
        <this.TooltipTrigger>Hover me</this.TooltipTrigger>
        <this.TooltipPortal>
          <this.TooltipPositioner>
            <this.TooltipPopup>Tooltip content</this.TooltipPopup>
          </this.TooltipPositioner>
        </this.TooltipPortal>
      </this.TooltipRoot>
    );

    const utils = tooltipTester.testBasicRender(ui);
    return utils.renderResult;
  },

  async testInteractions() {
    const result = await this.testCompoundStructure();
    const utils = createHeadlessTestUtils(result);

    const trigger = result.getByText('Hover me');

    // Test hover interaction
    await utils.testHoverInteraction({
      trigger,
      expectedContent: 'Tooltip content',
      shouldAppear: true,
    });

    // Test focus interaction  
    await utils.testFocusInteraction({
      trigger,
      expectedContent: 'Tooltip content',
      shouldOpen: true,
    });
  },

  async testEventHandling() {
    const onOpenChange = vi.fn();
    const { render } = createRenderer();

    const result = render(
      <this.TooltipProvider>
        <this.TooltipRoot onOpenChange={onOpenChange}>
          <this.TooltipTrigger>Trigger</this.TooltipTrigger>
          <this.TooltipPortal>
            <this.TooltipPositioner>
              <this.TooltipPopup>Content</this.TooltipPopup>
            </this.TooltipPositioner>
          </this.TooltipPortal>
        </this.TooltipRoot>
      </this.TooltipProvider>
    );

    const eventRunner = createEventTestRunner(result);
    const trigger = result.getByText('Trigger');

    await eventRunner.testAsyncEventHandling({
      element: trigger,
      eventType: 'mouseenter',
      asyncHandler: async () => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      },
    });
  },
};

/**
 * Example: Testing a Menu compound component with keyboard navigation
 */
export const menuExample = {
  // Mock Menu components
  MenuRoot: ({ children }: any) => React.createElement('div', { role: 'menu' }, children),
  MenuTrigger: ({ children, ...props }: any) => React.createElement('button', { ...props }, children),
  MenuItem: ({ children, ...props }: any) => React.createElement('div', { role: 'menuitem', tabIndex: 0, ...props }, children),

  async testKeyboardNavigation() {
    const { render } = createRenderer();
    
    const result = render(
      <this.MenuRoot>
        <this.MenuTrigger>Menu</this.MenuTrigger>
        <this.MenuItem>Item 1</this.MenuItem>
        <this.MenuItem>Item 2</this.MenuItem>
        <this.MenuItem>Item 3</this.MenuItem>
      </this.MenuRoot>
    );

    const utils = createHeadlessTestUtils(result);
    const menu = result.getByRole('menu');

    // Test keyboard patterns specific to menus
    await testKeyboardPatterns(menu, KEYBOARD_PATTERNS.MENU);
  },

  async testEventPrevention() {
    const { render } = createRenderer();
    const onClick = vi.fn();
    
    const result = render(
      <this.MenuRoot>
        <this.MenuItem onClick={onClick}>
          Preventable Item
        </this.MenuItem>
      </this.MenuRoot>
    );

    const eventRunner = createEventTestRunner(result);
    const menuItem = result.getByText('Preventable Item');

    // Test that events can be prevented
    await eventRunner.testEventPrevention({
      element: menuItem,
      eventType: 'click',
      handler: onClick,
      preventHandler: true,
    });
  },
};

/**
 * Example: Testing accessibility patterns
 */
export const accessibilityExample = {
  async testCommonA11yPatterns() {
    const { render } = createRenderer();
    
    const result = render(
      <div role="button" tabIndex={0} aria-label="Accessible button">
        Click me
      </div>
    );

    const element = result.getByRole('button');
    const a11yRunner = createA11yTestRunner(result, {
      keyboardNavigation: true,
      screenReader: true,
      focusManagement: true,
    });

    const testResults = await a11yRunner.runAllTests(element);
    console.log('A11y test results:', testResults);
  },
};

/**
 * Example: Testing performance
 */
export const performanceExample = {
  HeavyComponent: ({ items = [] }: { items?: any[] }) => 
    React.createElement('div', {}, 
      items.map((item, index) => 
        React.createElement('div', { key: index }, `Item ${index}: ${item}`)
      )
    ),

  async testRenderPerformance() {
    const largeDataSet = Array.from({ length: 1000 }, (_, i) => `Data ${i}`);

    await testComponentPerformance({
      Component: this.HeavyComponent,
      props: { items: largeDataSet },
      thresholds: {
        maxRenderTime: 200, // Allow more time for heavy component
        maxUpdateTime: 100,
        maxMemoryUsage: 20,
      },
    });
  },
};
