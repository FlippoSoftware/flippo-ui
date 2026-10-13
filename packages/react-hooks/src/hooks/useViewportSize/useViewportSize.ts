import React from 'react';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useStableCallback } from '../useStableCallback';
import { useWindowEvent } from '../useWindowEvent';

const eventListerOptions = {
    passive: true
};

export function useViewportSize() {
    const [windowSize, setWindowSize] = React.useState({
        width: 0,
        height: 0
    });

    const setSize = useStableCallback(() => {
        setWindowSize({ width: window.innerWidth || 0, height: window.innerHeight || 0 });
    });

    useWindowEvent('resize', setSize, eventListerOptions);
    useWindowEvent('orientationchange', setSize, eventListerOptions);
    useIsoLayoutEffect(setSize, []);

    return windowSize;
}
