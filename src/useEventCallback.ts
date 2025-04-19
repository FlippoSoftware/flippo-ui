'use client';

import * as React from 'react';
import { useEnhancedEffect } from './useEnhancedEffect';

type AnyFunction = (...args: any[])=> any;

export function useEventCallback<Fn extends AnyFunction>(fn?: Fn) {
  const fnRef = React.useRef(fn);

  useEnhancedEffect(() => {
    fnRef.current = fn;
  });

  return React.useCallback<AnyFunction>((...args) => fnRef.current?.(...args), []) as Fn;
}
