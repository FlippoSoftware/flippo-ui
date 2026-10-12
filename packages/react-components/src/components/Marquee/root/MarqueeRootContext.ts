import React from 'react';

import type { MarqueeMachine } from '@flippo-software/core-components/marquee';

import type { Orientation } from '~@lib/types';

export type MarqueeRootContextValue = {
    /**
     * The core machine: measures the content and provides the functional styles.
     */
    marquee: MarqueeMachine;
    /**
     * Number of times to multiply the content.
     */
    multiplier: number;
    /**
     * The orientation of the marquee (horizontal or vertical).
     */
    orientation: Orientation;
    /**
     * Callback for animation iteration.
     */
    onAnimationIteration?: () => void;
    /**
     * Callback for animation end.
     */
    onAnimationEnd?: () => void;
};

export const MarqueeRootContext = React.createContext<MarqueeRootContextValue | undefined>(undefined);

export function useMarqueeRootContext(): MarqueeRootContextValue {
    const context = React.use(MarqueeRootContext);
    if (context === undefined) {
        throw new Error('Headless UI: MarqueeRootContext is missing. Marquee parts must be placed within <Marquee.Root>.');
    }

    return context;
}
