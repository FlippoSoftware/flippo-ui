import * as React from 'react';

export interface DirectionProviderProps {
  children: React.ReactNode;
  direction: 'ltr' | 'rtl';
}

/**
 * Direction provider for testing RTL/LTR layouts
 */
export function DirectionProvider({ children, direction }: DirectionProviderProps) {
  React.useEffect(() => {
    // Set the HTML dir attribute for testing
    document.documentElement.dir = direction;
    
    return () => {
      // Reset to default
      document.documentElement.dir = 'ltr';
    };
  }, [direction]);

  // Create a context that components can use if needed
  return React.createElement(
    'div',
    {
      dir: direction,
      'data-testid': 'direction-provider',
    },
    children
  );
}
