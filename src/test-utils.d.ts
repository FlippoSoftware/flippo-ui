/**
 * TypeScript declarations for @flippo/internal-test-utils
 */

import '@testing-library/jest-dom';
import './matchers/types';

declare global {
  namespace globalThis {
    var debugElement: (element: HTMLElement) => void;
    var debugDOM: () => void;
  }

  interface Window {
    debugElement: (element: HTMLElement) => void;
    debugDOM: () => void;
  }

  // Extend HTMLElement with custom properties that might be added by tests
  interface HTMLElement {
    'data-flippo-component'?: string;
    'data-focus'?: string;
    'data-testid'?: string;
  }

  // Performance memory interface
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}
