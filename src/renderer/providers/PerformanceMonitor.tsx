import * as React from 'react';

export interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export interface PerformanceMetrics {
  renderTime: number;
  updateCount: number;
  lastUpdateTime: number;
}

/**
 * Performance monitoring context for testing
 */
export const PerformanceContext = React.createContext<PerformanceMetrics | null>(null);

/**
 * Performance monitor provider for testing component performance
 */
export function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    renderTime: 0,
    updateCount: 0,
    lastUpdateTime: 0,
  });

  const startTime = React.useRef<number>(performance.now());
  const updateCount = React.useRef<number>(0);

  React.useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    updateCount.current += 1;
    
    setMetrics({
      renderTime,
      updateCount: updateCount.current,
      lastUpdateTime: performance.now(),
    });
  });

  return React.createElement(
    PerformanceContext.Provider,
    { value: metrics },
    children
  );
}

/**
 * Hook to access performance metrics in tests
 */
export function usePerformanceMetrics(): PerformanceMetrics | null {
  return React.useContext(PerformanceContext);
}
