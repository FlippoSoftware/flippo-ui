import type { AccordionChangeEventDetails, AccordionItemMachine, AccordionValue } from '@flippo-software/core-components/accordion';
import type { CollapsibleChangeEventDetails } from '@flippo-software/core-components/collapsible';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { AccordionItemElement } from '../item/AccordionItemElement';

import type { AccordionElement } from './AccordionElement';

export type AccordionValueChangeDetail = {
    value: AccordionValue;
    reason: AccordionChangeEventDetails['reason'];
};

export type AccordionItemOpenChangeDetail = {
    open: boolean;
    reason: CollapsibleChangeEventDetails['reason'];
};

export const AccordionContext = createContext<AccordionElement>('accordion');

export const AccordionItemContext = createContext<AccordionItemElement>('accordion-item');

export const ACCORDION = [AccordionContext] as const;

const ACCORDION_ITEM = [AccordionItemContext] as const;

export abstract class AccordionItemPart extends ContextPart<typeof ACCORDION_ITEM> {
    protected readonly contexts = ACCORDION_ITEM;

    protected get item(): AccordionItemMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }
}
