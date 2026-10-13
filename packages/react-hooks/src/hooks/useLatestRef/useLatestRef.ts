import React from 'react';

import { useEnhancedEffect } from '../useEnhancedEffect';

export function useLatestRef<T>(value: T) {
    const valueRef = React.useRef(value);

    useEnhancedEffect(() => {
        valueRef.current = value;
    });

    return valueRef;
}
