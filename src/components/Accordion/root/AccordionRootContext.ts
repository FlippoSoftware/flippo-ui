import React from 'react';

import type { TextDirection } from '~@lib/hooks';
import type { Orientation } from '~@lib/types';

import type { AccordionRoot, AccordionValue } from './AccordionRoot';

export type AccordionRootContextValue = {
    accordionItemRefs: React.RefObject<(HTMLElement | null)[]>;
    direction: TextDirection;
    disabled: boolean;
    handleValueChange: (newValue: number | string, nextOpen: boolean) => void;
    hiddenUntilFound: boolean;
    keepMounted: boolean;
    loopFocus: boolean;
    orientation: Orientation;
    state: AccordionRoot.State;
    value: AccordionValue;
};

export const AccordionRootContext = React.createContext<AccordionRootContextValue | undefined>(
    undefined
);

export function useAccordionRootContext() {
    const context = React.use(AccordionRootContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: AccordionRootContext is missing. Accordion parts must be placed within <Accordion.Root>.'
        );
    }

    return context;
}
