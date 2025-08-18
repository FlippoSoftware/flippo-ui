'use client';

import React from 'react';

import type { AccordionItem } from './AccordionItem';

export type TAccordionItemContext = {
    open: boolean;
    state: AccordionItem.State;
    setTriggerId: (id: string | undefined) => void;
    triggerId?: string;
};

export const AccordionItemContext = React.createContext<TAccordionItemContext | undefined>(
    undefined
);

export function useAccordionItemContext() {
    const context = React.use(AccordionItemContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: AccordionItemContext is missing. Accordion parts must be placed within <Accordion.Item>.'
        );
    }
    return context;
}
