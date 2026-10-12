import React from 'react';

import type { AccordionMachine } from '@flippo-software/core-components/accordion';

import type { AccordionRoot } from './AccordionRoot';

export type AccordionRootContextValue = {
    /**
     * The core machine: value, keyboard navigation between the triggers, defaults of the panels.
     */
    accordion: AccordionMachine;
    state: AccordionRoot.State;
};

export const AccordionRootContext = React.createContext<AccordionRootContextValue | undefined>(undefined);

export function useAccordionRootContext() {
    const context = React.use(AccordionRootContext);
    if (context === undefined) {
        throw new Error('Headless UI: AccordionRootContext is missing. Accordion parts must be placed within <Accordion.Root>.');
    }
    return context;
}
