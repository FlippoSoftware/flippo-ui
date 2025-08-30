import * as React from 'react';
import { act } from '@testing-library/react';
import { expect } from 'vitest';

import type { PerformanceThresholds, HeadlessRenderResult } from '../types';
import { createRenderer } from '../renderer/createRenderer';

/**
 * Performance testing utilities for headless components
 */
export class PerformanceTestRunner {
  private thresholds: Required<PerformanceThresholds>;

  constructor(thresholds: PerformanceThresholds = {}) {
    this.thresholds = {
      maxRenderTime: 100,
      maxUpdateTime: 50, 
      maxMemoryUsage: 10,
      ...thresholds,
    };
  }

  /**
   * Measure component render time
   */
  async measureRenderTime(renderFn: () => Promise<HeadlessRenderResult> | HeadlessRenderResult): Promise<number> {
    const startTime = performance.now();
    
    await act(async () => {
      await renderFn();
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > this.thresholds.maxRenderTime) {
      console.warn(`Render time exceeded threshold: ${renderTime}ms > ${this.thresholds.maxRenderTime}ms`);
    }

    return renderTime;
  }

  /**
   * Measure component update time
   */
  async measureUpdateTime(updateFn: () => Promise<void> | void): Promise<number> {
    const startTime = performance.now();
    
    await act(async () => {
      await updateFn();
    });
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;

    if (updateTime > this.thresholds.maxUpdateTime) {
      console.warn(`Update time exceeded threshold: ${updateTime}ms > ${this.thresholds.maxUpdateTime}ms`);
    }

    return updateTime;
  }

  /**
   * Measure memory usage (rough estimation)
   */
  measureMemoryUsage(): number {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const memoryUsageMB = (memInfo.usedJSHeapSize / 1024 / 1024);
      
      if (memoryUsageMB > this.thresholds.maxMemoryUsage) {
        console.warn(`Memory usage exceeded threshold: ${memoryUsageMB}MB > ${this.thresholds.maxMemoryUsage}MB`);
      }
      
      return memoryUsageMB;
    }
    
    return 0; // Memory measurement not available
  }

  /**
   * Run comprehensive performance test
   */
  async runPerformanceTest(config: {
    name: string;
    renderFn: () => Promise<HeadlessRenderResult> | HeadlessRenderResult;
    updateFn?: () => Promise<void> | void;
    expectations?: {
      renderTime?: number;
      updateTime?: number;
      memoryUsage?: number;
    };
  }): Promise<{
    renderTime: number;
    updateTime?: number;
    memoryUsage: number;
    passed: boolean;
  }> {
    const { name, renderFn, updateFn, expectations = {} } = config;

    console.log(`Starting performance test: ${name}`);

    // Measure render time
    const renderTime = await this.measureRenderTime(renderFn);

    // Measure update time if provided
    let updateTime: number | undefined;
    if (updateFn) {
      updateTime = await this.measureUpdateTime(updateFn);
    }

    // Measure memory usage
    const memoryUsage = this.measureMemoryUsage();

    // Check expectations
    const renderPassed = !expectations.renderTime || renderTime <= expectations.renderTime;
    const updatePassed = !expectations.updateTime || !updateTime || updateTime <= expectations.updateTime;
    const memoryPassed = !expectations.memoryUsage || memoryUsage <= expectations.memoryUsage;

    const passed = renderPassed && updatePassed && memoryPassed;

    if (!passed) {
      const failures = [];
      if (!renderPassed) failures.push(`Render time: ${renderTime}ms > ${expectations.renderTime}ms`);
      if (!updatePassed) failures.push(`Update time: ${updateTime}ms > ${expectations.updateTime}ms`);
      if (!memoryPassed) failures.push(`Memory usage: ${memoryUsage}MB > ${expectations.memoryUsage}MB`);
      
      console.error(`Performance test failed for ${name}:\n${failures.join('\n')}`);
    }

    return {
      renderTime,
      updateTime,
      memoryUsage,
      passed,
    };
  }

  /**
   * Benchmark component with different prop sets
   */
  async benchmarkComponent(config: {
    name: string;
    Component: React.ComponentType<any>;
    propsSets: Array<{ name: string; props: any }>;
    iterations?: number;
  }): Promise<Record<string, { renderTime: number; memoryUsage: number }>> {
    const { name, Component, propsSets, iterations = 10 } = config;
    const results: Record<string, { renderTime: number; memoryUsage: number }> = {};

    for (const propsSet of propsSets) {
      const renderTimes: number[] = [];
      const memoryUsages: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const renderTime = await this.measureRenderTime(() => {
          const { render } = createRenderer();
          return render(React.createElement(Component, propsSet.props));
        });
        
        const memoryUsage = this.measureMemoryUsage();
        
        renderTimes.push(renderTime);
        memoryUsages.push(memoryUsage);
      }

      // Calculate averages
      const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / iterations;
      const avgMemoryUsage = memoryUsages.reduce((sum, usage) => sum + usage, 0) / iterations;

      results[propsSet.name] = {
        renderTime: avgRenderTime,
        memoryUsage: avgMemoryUsage,
      };
    }

    console.log(`Benchmark results for ${name}:`, results);
    return results;
  }
}

/**
 * Create performance test runner
 */
export function createPerformanceRunner(thresholds?: PerformanceThresholds): PerformanceTestRunner {
  return new PerformanceTestRunner(thresholds);
}

/**
 * Quick performance test for a component
 */
export async function testComponentPerformance(config: {
  Component: React.ComponentType<any>;
  props?: any;
  thresholds?: PerformanceThresholds;
}) {
  const { Component, props = {}, thresholds } = config;
  const runner = createPerformanceRunner(thresholds);
  
  const result = await runner.runPerformanceTest({
    name: Component.displayName || Component.name || 'Component',
    renderFn: () => {
      const { render } = createRenderer();
      return render(React.createElement(Component, props));
    },
  });

  expect(result.passed, 
    `Component performance test failed. Render time: ${result.renderTime}ms, Memory: ${result.memoryUsage}MB`
  ).toBe(true);

  return result;
}

/**
 * Test component performance under stress (many re-renders)
 */
export async function testStressPerformance(config: {
  Component: React.ComponentType<any>;
  initialProps: any;
  propChanges: any[];
  thresholds?: PerformanceThresholds;
}): Promise<{
  totalTime: number;
  averageUpdateTime: number;
  maxUpdateTime: number;
  passed: boolean;
}> {
  const { Component, initialProps, propChanges, thresholds } = config;
  const runner = createPerformanceRunner(thresholds);
  
  const { render } = createRenderer();
  const { rerender } = render(React.createElement(Component, initialProps));

  const updateTimes: number[] = [];
  const startTime = performance.now();

  for (const newProps of propChanges) {
    const updateTime = await runner.measureUpdateTime(() => {
      rerender(React.createElement(Component, newProps));
    });
    updateTimes.push(updateTime);
  }

  const totalTime = performance.now() - startTime;
  const averageUpdateTime = updateTimes.reduce((sum, time) => sum + time, 0) / updateTimes.length;
  const maxUpdateTime = Math.max(...updateTimes);

  const passed = averageUpdateTime <= (thresholds?.maxUpdateTime || 50) &&
                 maxUpdateTime <= (thresholds?.maxUpdateTime || 50) * 2;

  return {
    totalTime,
    averageUpdateTime,
    maxUpdateTime,
    passed,
  };
}
