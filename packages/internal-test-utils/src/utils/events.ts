import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { vi, expect } from 'vitest';

import type { HeadlessRenderResult } from '../types';

/**
 * Event testing utilities for headless components
 */
export class EventTestRunner {
  private renderResult: HeadlessRenderResult;

  constructor(renderResult: HeadlessRenderResult) {
    this.renderResult = renderResult;
  }

  /**
   * Test that HeadlessUIEvent prevents default handler when requested
   */
  async testEventPrevention(config: {
    element: HTMLElement;
    eventType: string;
    handler: ReturnType<typeof vi.fn>;
    preventHandler: boolean;
    eventOptions?: any;
  }) {
    const { element, eventType, handler, preventHandler, eventOptions } = config;

    handler.mockClear();

    // Create event with preventHeadlessUIHandler capability
    const createEvent = (type: string, options: any = {}) => {
      const event = new Event(type, { bubbles: true, cancelable: true, ...options });
      
      // Add HeadlessUI event properties
      Object.defineProperties(event, {
        preventHeadlessUIHandler: {
          value: () => {
            (event as any).headlessUIHandlerPrevented = true;
          },
          writable: false,
        },
        headlessUIHandlerPrevented: {
          value: false,
          writable: true,
        },
      });

      return event;
    };

    if (preventHandler) {
      // Test that prevention works
      const event = createEvent(eventType, eventOptions);
      (event as any).preventHeadlessUIHandler();
      
      element.dispatchEvent(event);
      
      expect((event as any).headlessUIHandlerPrevented).toBe(true);
    } else {
      // Test normal event flow
      fireEvent[eventType as keyof typeof fireEvent](element, eventOptions);
      expect(handler).toHaveBeenCalled();
    }
  }

  /**
   * Test event bubbling behavior
   */
  async testEventBubbling(config: {
    parentElement: HTMLElement;
    childElement: HTMLElement;
    eventType: string;
    shouldBubble: boolean;
    parentHandler: ReturnType<typeof vi.fn>;
    childHandler: ReturnType<typeof vi.fn>;
  }) {
    const { 
      parentElement, 
      childElement, 
      eventType, 
      shouldBubble, 
      parentHandler, 
      childHandler 
    } = config;

    parentHandler.mockClear();
    childHandler.mockClear();

    // Add event listeners
    parentElement.addEventListener(eventType, parentHandler);
    childElement.addEventListener(eventType, childHandler);

    // Trigger event on child
    fireEvent[eventType as keyof typeof fireEvent](childElement);

    expect(childHandler).toHaveBeenCalled();

    if (shouldBubble) {
      expect(parentHandler).toHaveBeenCalled();
    } else {
      expect(parentHandler).not.toHaveBeenCalled();
    }
  }

  /**
   * Test custom event handling with proper typing
   */
  async testCustomEventHandling(config: {
    element: HTMLElement;
    customEvents: Array<{
      name: string;
      data: any;
      handler: ReturnType<typeof vi.fn>;
      expectedCallCount?: number;
    }>;
  }) {
    const { element, customEvents } = config;

    for (const { name, data, handler, expectedCallCount = 1 } of customEvents) {
      handler.mockClear();

      // Add event listener
      element.addEventListener(name, handler);

      // Dispatch custom event
      const customEvent = new CustomEvent(name, { detail: data });
      element.dispatchEvent(customEvent);

      expect(handler).toHaveBeenCalledTimes(expectedCallCount);
      
      if (data) {
        expect(handler).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: data,
          })
        );
      }
    }
  }

  /**
   * Test event timing and debouncing
   */
  async testEventTiming(config: {
    element: HTMLElement;
    eventType: string;
    handler: ReturnType<typeof vi.fn>;
    rapidFireCount: number;
    expectedCallCount: number;
    debounceTime?: number;
  }) {
    const { 
      element, 
      eventType, 
      handler, 
      rapidFireCount, 
      expectedCallCount, 
      debounceTime = 0 
    } = config;

    handler.mockClear();

    // Fire events rapidly
    for (let i = 0; i < rapidFireCount; i++) {
      fireEvent[eventType as keyof typeof fireEvent](element);
    }

    if (debounceTime > 0) {
      // Wait for debounce
      await waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(expectedCallCount);
      }, { timeout: debounceTime + 100 });
    } else {
      expect(handler).toHaveBeenCalledTimes(expectedCallCount);
    }
  }

  /**
   * Test async event handling
   */
  async testAsyncEventHandling(config: {
    element: HTMLElement;
    eventType: string;
    asyncHandler: () => Promise<void>;
    timeout?: number;
  }) {
    const { element, eventType, asyncHandler, timeout = 1000 } = config;
    
    const handlerSpy = vi.fn().mockImplementation(asyncHandler);
    
    element.addEventListener(eventType, handlerSpy);
    
    fireEvent[eventType as keyof typeof fireEvent](element);
    
    await waitFor(() => {
      expect(handlerSpy).toHaveBeenCalled();
    }, { timeout });
  }
}

/**
 * Create event test runner for a rendered component
 */
export function createEventTestRunner(renderResult: HeadlessRenderResult): EventTestRunner {
  return new EventTestRunner(renderResult);
}

/**
 * Test common headless UI event patterns
 */
export function testCommonEventPatterns() {
  return {
    /**
     * Test click outside behavior (for dialogs, menus, etc.)
     */
    async clickOutside(config: {
      renderResult: HeadlessRenderResult;
      triggerElement: HTMLElement;
      outsideElement?: HTMLElement;
      onClickOutside: ReturnType<typeof vi.fn>;
    }) {
      const { renderResult, triggerElement, outsideElement, onClickOutside } = config;
      const { user } = renderResult;

      onClickOutside.mockClear();

      // Click outside
      const target = outsideElement || document.body;
      await user.click(target);

      expect(onClickOutside).toHaveBeenCalled();
    },

    /**
     * Test escape key behavior
     */
    async escapeKey(config: {
      element: HTMLElement;
      onEscape: ReturnType<typeof vi.fn>;
      shouldPreventDefault?: boolean;
    }) {
      const { element, onEscape, shouldPreventDefault = false } = config;

      onEscape.mockClear();

      const event = new KeyboardEvent('keydown', { 
        key: 'Escape', 
        bubbles: true, 
        cancelable: true 
      });

      if (shouldPreventDefault) {
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
        element.dispatchEvent(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
      } else {
        element.dispatchEvent(event);
      }

      expect(onEscape).toHaveBeenCalled();
    },

    /**
     * Test focus trap behavior (for modals, dialogs)
     */
    async focusTrap(config: {
      renderResult: HeadlessRenderResult;
      containerElement: HTMLElement;
      focusableElements: HTMLElement[];
    }) {
      const { renderResult, containerElement, focusableElements } = config;
      const { user } = renderResult;

      if (focusableElements.length === 0) {
        throw new Error('Focus trap test requires at least one focusable element');
      }

      // Focus first element
      focusableElements[0].focus();
      expect(focusableElements[0]).toHaveFocus();

      // Tab through all elements
      for (let i = 1; i < focusableElements.length; i++) {
        await user.tab();
        expect(focusableElements[i]).toHaveFocus();
      }

      // Tab from last element should cycle to first
      await user.tab();
      expect(focusableElements[0]).toHaveFocus();

      // Shift+Tab should go to last element
      await user.tab({ shift: true });
      expect(focusableElements[focusableElements.length - 1]).toHaveFocus();
    },

    /**
     * Test portal event handling
     */
    async portalEvents(config: {
      renderResult: HeadlessRenderResult;
      portalElement: HTMLElement;
      sourceElement: HTMLElement;
      eventType: string;
      handler: ReturnType<typeof vi.fn>;
    }) {
      const { renderResult, portalElement, sourceElement, eventType, handler } = config;

      handler.mockClear();

      // Events in portal should still be handled by source component
      fireEvent[eventType as keyof typeof fireEvent](portalElement);
      
      await waitFor(() => {
        expect(handler).toHaveBeenCalled();
      });
    },
  };
}

/**
 * Mock HeadlessUI event for testing
 */
export function createMockHeadlessUIEvent<T extends React.SyntheticEvent>(
  baseEvent: T,
  options: { prevented?: boolean } = {}
): T & { preventHeadlessUIHandler: () => void; headlessUIHandlerPrevented: boolean } {
  const { prevented = false } = options;

  return Object.assign(baseEvent, {
    preventHeadlessUIHandler: vi.fn(() => {
      (baseEvent as any).headlessUIHandlerPrevented = true;
    }),
    headlessUIHandlerPrevented: prevented,
  });
}

/**
 * Test event handler merging behavior
 */
export function testEventHandlerMerging(config: {
  renderResult: HeadlessRenderResult;
  element: HTMLElement;
  internalHandler: ReturnType<typeof vi.fn>;
  externalHandler: ReturnType<typeof vi.fn>;
  eventType: string;
  shouldCallBoth?: boolean;
  shouldPrevent?: boolean;
}) {
  const { 
    element, 
    internalHandler, 
    externalHandler, 
    eventType, 
    shouldCallBoth = true,
    shouldPrevent = false 
  } = config;

  internalHandler.mockClear();
  externalHandler.mockClear();

  const event = createMockHeadlessUIEvent(
    new Event(eventType) as any,
    { prevented: shouldPrevent }
  );

  element.dispatchEvent(event);

  expect(externalHandler).toHaveBeenCalled();

  if (shouldCallBoth && !shouldPrevent) {
    expect(internalHandler).toHaveBeenCalled();
  } else if (shouldPrevent) {
    expect(internalHandler).not.toHaveBeenCalled();
  }
}
