/**
 * Real-world examples of testing Flippo headless components
 * These examples show how to test actual patterns used in your component library
 */

import * as React from 'react';
import { vi, describe, it } from 'vitest';

import { 
  createRenderer, 
  createHeadlessTestUtils,
  testCompoundPatterns,
  testAriaRelationships,
  createA11yTestRunner,
  testComponentPerformance,
} from '../index';

/**
 * Example: Testing Avatar component with image loading states
 */
export function testAvatarComponent() {
  describe('Avatar Component', () => {
    const { render } = createRenderer();

    it('should handle image loading states', async () => {
      const onImageLoad = vi.fn();
      const onImageError = vi.fn();

      const result = render(
        <div> {/* Mock Avatar.Root */}
          <img // Mock Avatar.Image
            src="test-avatar.jpg"
            alt="Test Avatar"
            onLoad={onImageLoad}
            onError={onImageError}
          />
          <div>Fallback</div> {/* Mock Avatar.Fallback */}
        </div>
      );

      const utils = createHeadlessTestUtils(result);
      const img = result.getByRole('img');

      // Test successful image load
      await utils.testEventHandler({
        element: img,
        event: 'load',
        handler: onImageLoad,
      });

      // Test accessibility
      utils.testAccessibilityAttributes(img, {
        'alt': 'Test Avatar',
        'aria-hidden': null, // Should not have aria-hidden
      });
    });

    it('should meet performance requirements', async () => {
      const MockAvatar = ({ src, alt }: any) => 
        React.createElement('img', { src, alt, role: 'img' });

      await testComponentPerformance({
        Component: MockAvatar,
        props: {
          src: 'test-image.jpg',
          alt: 'Performance test avatar',
        },
        thresholds: {
          maxRenderTime: 20, // Very fast for simple image
          maxUpdateTime: 10,
        },
      });
    });
  });
}

/**
 * Example: Testing Dialog compound component
 */
export function testDialogComponent() {
  describe('Dialog Component', () => {
    const dialogTester = testCompoundPatterns().dialog;

    it('should handle compound structure correctly', async () => {
      const MockDialog = {
        Root: ({ children }: any) => React.createElement('div', { 'data-dialog-root': true }, children),
        Trigger: ({ children, ...props }: any) => React.createElement('button', { ...props }, children),
        Portal: ({ children }: any) => React.createElement('div', { 'data-portal': true }, children),
        Popup: ({ children, ...props }: any) => React.createElement('div', { role: 'dialog', ...props }, children),
      };

      const ui = (
        <MockDialog.Root>
          <MockDialog.Trigger>Open Dialog</MockDialog.Trigger>
          <MockDialog.Portal>
            <MockDialog.Popup>Dialog Content</MockDialog.Popup>
          </MockDialog.Portal>
        </MockDialog.Root>
      );

      const utils = await dialogTester.testPartConnections(ui);

      // Test ARIA relationships
      await testAriaRelationships({
        renderResult: utils.renderResult,
        relationships: [
          {
            source: 'button', // selector
            target: '[role="dialog"]', // selector
            attribute: 'aria-controls',
          },
        ],
      });
    });

    it('should handle keyboard interactions', async () => {
      const { render } = createRenderer();
      
      const result = render(
        <div role="dialog" tabIndex={-1}>
          <button>Close</button>
          <input placeholder="Name" />
          <button>Submit</button>
        </div>
      );

      const utils = createHeadlessTestUtils(result);
      const dialog = result.getByRole('dialog');

      // Test escape key closes dialog
      await utils.testKeyboardNavigation({
        trigger: dialog,
        key: 'Escape',
        expectFocus: false,
      });
    });
  });
}

/**
 * Example: Testing Menu component with complex interactions
 */
export function testMenuComponent() {
  describe('Menu Component', () => {
    it('should handle arrow key navigation', async () => {
      const { render } = createRenderer();
      
      const result = render(
        <div role="menu">
          <div role="menuitem" tabIndex={0} data-testid="item-1">Item 1</div>
          <div role="menuitem" tabIndex={0} data-testid="item-2">Item 2</div>
          <div role="menuitem" tabIndex={0} data-testid="item-3">Item 3</div>
        </div>
      );

      const utils = createHeadlessTestUtils(result);
      const firstItem = result.getByTestId('item-1');
      const secondItem = result.getByTestId('item-2');

      // Test arrow down navigation
      await utils.testKeyboardNavigation({
        trigger: firstItem,
        expectedTarget: secondItem,
        key: 'ArrowDown',
      });
    });

    it('should pass accessibility audit', async () => {
      const { render } = createRenderer();
      
      const result = render(
        <div>
          <button aria-controls="menu-1" aria-expanded="false">Menu</button>
          <div role="menu" id="menu-1">
            <div role="menuitem">Option 1</div>
            <div role="menuitem">Option 2</div>
          </div>
        </div>
      );

      const menu = result.getByRole('menu');
      const a11yRunner = createA11yTestRunner(result, {
        keyboardNavigation: true,
        screenReader: true,
      });

      const results = await a11yRunner.runAllTests(menu);
      expect(results.every(r => r.passed)).toBe(true);
    });
  });
}

/**
 * Example: Testing form components
 */
export function testFormComponents() {
  describe('Form Components', () => {
    it('should handle field validation', async () => {
      const { render } = createRenderer();
      const onInvalid = vi.fn();
      
      const result = render(
        <form>
          <div> {/* Mock Field.Root */}
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              required
              onInvalid={onInvalid}
              data-testid="email-input"
            />
            <div role="alert" id="email-error">Invalid email</div>
          </div>
        </form>
      );

      const utils = createHeadlessTestUtils(result);
      const emailInput = result.getByTestId('email-input');

      // Test validation
      await utils.testEventHandler({
        element: emailInput,
        event: 'invalid',
        handler: onInvalid,
      });

      // Test ARIA relationships
      await testAriaRelationships({
        renderResult: result,
        relationships: [
          {
            source: 'email-input',
            target: 'email-error',
            attribute: 'aria-describedby',
          },
        ],
      });
    });
  });
}

/**
 * Example: Testing components with floating UI
 */
export function testFloatingComponents() {
  describe('Floating Components', () => {
    it('should position popover correctly', async () => {
      const { render } = createRenderer();
      
      const result = render(
        <div>
          <button data-testid="trigger">Trigger</button>
          <div 
            data-testid="popup"
            style={{ position: 'absolute', top: '100px', left: '50px' }}
          >
            Popup content
          </div>
        </div>
      );

      const popup = result.getByTestId('popup');
      
      // Custom matcher для проверки позиционирования
      expect(popup).toBeProperlyPositioned({
        top: 100,
        left: 50,
      });
    });
  });
}
