import React from 'react';

import type { AccordionItemMachine } from '@flippo-software/core-components/accordion';

import type { AccordionItem } from './AccordionItem';

export type AccordionItemContextValue = {
    /**
     * The core machine of the item (wraps its collapsible).
     */
    item: AccordionItemMachine;
    state: AccordionItem.State;
    /**
     * Generated id of the trigger, used when the trigger has no `id` prop.
     */
    defaultTriggerId: string;
};

export const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(undefined);

export function useAccordionItemContext() {
    const context = React.use(AccordionItemContext);
    if (context === undefined) {
        throw new Error('Headless UI: AccordionItemContext is missing. Accordion parts must be placed within <Accordion.Item>.');
    }
    return context;
}
