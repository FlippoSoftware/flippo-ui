import React from 'react';

import type { SliderMachine } from '@flippo-software/core-components/slider';

import type { SliderRoot } from './SliderRoot';

export type SliderRootContextValue = {
    /**
     * The core machine: values, pointer and keyboard interaction, thumb positions and field integration.
     */
    slider: SliderMachine;
    state: SliderRoot.State;
};

export const SliderRootContext = React.createContext<SliderRootContextValue | undefined>(undefined);

export function useSliderRootContext() {
    const context = React.use(SliderRootContext);
    if (context === undefined) {
        throw new Error('Headless UI: SliderRootContext is missing. Slider parts must be placed within <Slider.Root>.');
    }
    return context;
}
