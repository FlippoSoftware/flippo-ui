/**
 * Example integration test showing how to use @flippo/internal-test-utils
 * with actual Tooltip component from the headless components package
 */

import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { 
  createRenderer, 
  createHeadlessTestUtils,
  testAriaRelationships,
  createA11yTestRunner,
  testCommonEventPatterns,
  expect,
} from '../index';

// This would normally be imported from your actual component package:
// import { Tooltip } from '@flippo-ui/headless-components/tooltip';

/**
 * Mock Tooltip components for demonstration
 * In real usage, you would import these from your component library
 */
const MockTooltip = {
  Provider: ({ children }: any) => <div data-tooltip-provider>{children}</div>,
  Root: ({ children, onOpenChange }: any) => (
    <div data-tooltip-root onOpenChange={onOpenChange}>
      {children}
    </div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="tooltip-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children }: any) => (
    <div data-portal>{children}</div>
  ),
  Positioner: ({ children }: any) => (
    <div data-positioner>{children}</div>
  ),
  Popup: ({ children, ...props }: any) => (
    <div 
      role="tooltip" 
      data-testid="tooltip-popup"
      id="tooltip-popup"
      {...props}
    >
      {children}
    </div>
  ),
};

describe('Tooltip Integration Test', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render and show/hide on hover', async () => {
    const onOpenChange = vi.fn();

    const result = render(
      <MockTooltip.Provider>
        <MockTooltip.Root onOpenChange={onOpenChange}>
          <MockTooltip.Trigger>Hover me</MockTooltip.Trigger>
          <MockTooltip.Portal>
            <MockTooltip.Positioner>
              <MockTooltip.Popup>Tooltip content</MockTooltip.Popup>
            </MockTooltip.Positioner>
          </MockTooltip.Portal>
        </MockTooltip.Root>
      </MockTooltip.Provider>
    );

    const utils = createHeadlessTestUtils(result);
    const trigger = result.getByTestId('tooltip-trigger');

    // Test hover interaction using headless utilities
    await utils.testHoverInteraction({
      trigger,
      expectedContent: 'Tooltip content',
      shouldAppear: true,
    });

    // Verify onOpenChange was called
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should have proper accessibility attributes', async () => {
    const result = render(
      <MockTooltip.Provider>
        <MockTooltip.Root>
          <MockTooltip.Trigger>Accessible trigger</MockTooltip.Trigger>
          <MockTooltip.Portal>
            <MockTooltip.Positioner>
              <MockTooltip.Popup>Accessible content</MockTooltip.Popup>
            </MockTooltip.Positioner>
          </MockTooltip.Portal>
        </MockTooltip.Root>
      </MockTooltip.Provider>
    );

    // Test ARIA relationships between trigger and popup
    await testAriaRelationships({
      renderResult: result,
      relationships: [
        {
          source: 'tooltip-trigger',
          target: 'tooltip-popup',
          attribute: 'aria-describedby',
        },
      ],
    });

    // Run comprehensive accessibility tests
    const popup = result.getByTestId('tooltip-popup');
    const a11yRunner = createA11yTestRunner(result);
    
    const results = await a11yRunner.runAllTests(popup);
    expect(results.every(r => r.passed)).toBe(true);
  });

  it('should handle keyboard interactions', async () => {
    const result = render(
      <MockTooltip.Provider>
        <MockTooltip.Root>
          <MockTooltip.Trigger>Keyboard accessible</MockTooltip.Trigger>
          <MockTooltip.Portal>
            <MockTooltip.Positioner>
              <MockTooltip.Popup>Keyboard content</MockTooltip.Popup>
            </MockTooltip.Positioner>
          </MockTooltip.Portal>
        </MockTooltip.Root>
      </MockTooltip.Provider>
    );

    const utils = createHeadlessTestUtils(result);
    const trigger = result.getByTestId('tooltip-trigger');

    // Test focus interaction
    await utils.testFocusInteraction({
      trigger,
      expectedContent: 'Keyboard content',
      shouldOpen: true,
    });

    // Test escape key closes tooltip
    const patterns = testCommonEventPatterns();
    await patterns.escapeKey({
      element: trigger,
      onEscape: vi.fn(),
    });
  });

  it('should use custom matchers', () => {
    const result = render(
      <MockTooltip.Provider>
        <MockTooltip.Root>
          <MockTooltip.Trigger aria-expanded="false">Test trigger</MockTooltip.Trigger>
          <MockTooltip.Portal>
            <MockTooltip.Positioner>
              <MockTooltip.Popup>Test content</MockTooltip.Popup>
            </MockTooltip.Positioner>
          </MockTooltip.Portal>
        </MockTooltip.Root>
      </MockTooltip.Provider>
    );

    const trigger = result.getByTestId('tooltip-trigger');
    const popup = result.getByTestId('tooltip-popup');

    // Use custom matchers specific to headless components
    expect(trigger).toHaveHeadlessUIAttributes({
      'aria-expanded': false,
      'data-testid': 'tooltip-trigger',
    });

    expect(popup).toHaveHeadlessUIAttributes({
      'role': 'tooltip',
      'id': 'tooltip-popup',
    });

    // Test compound structure
    expect(result.container).toHaveCompoundParts([
      'tooltip-trigger',
      'tooltip-popup'
    ]);
  });
});
