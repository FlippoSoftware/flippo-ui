import React from 'react';

import { useEnhancedEffect } from './useEnhancedEffect';

export function useDidUpdate(callback: React.EffectCallback, deps?: React.DependencyList) {
    const isMountedRef = React.useRef(false);

    useEnhancedEffect(() => () => { isMountedRef.current = false; }, []);

    useEnhancedEffect(() => {
        if (isMountedRef.current) {
            return callback();
        }

        isMountedRef.current = true;
        return undefined;
    }, [deps]);
}
