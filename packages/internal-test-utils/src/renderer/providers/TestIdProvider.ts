import * as React from 'react';

export interface TestIdProviderProps {
  children: React.ReactNode;
  prefix?: string;
}

export interface TestIdContext {
  generateTestId: (componentName: string, part?: string) => string;
  prefix: string;
}

const TestIdContext = React.createContext<TestIdContext | null>(null);

/**
 * Provider for generating consistent test IDs across components
 */
export function TestIdProvider({ children, prefix = 'flippo-test' }: TestIdProviderProps) {
  const generateTestId = React.useCallback(
    (componentName: string, part?: string) => {
      const baseName = componentName.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
      return part ? `${prefix}-${baseName}-${part}` : `${prefix}-${baseName}`;
    },
    [prefix]
  );

  const contextValue = React.useMemo(
    () => ({
      generateTestId,
      prefix,
    }),
    [generateTestId, prefix]
  );

  return React.createElement(
    TestIdContext.Provider,
    { value: contextValue },
    children
  );
}

/**
 * Hook to access test ID utilities
 */
export function useTestId(): TestIdContext {
  const context = React.useContext(TestIdContext);
  if (!context) {
    throw new Error('useTestId must be used within a TestIdProvider');
  }
  return context;
}