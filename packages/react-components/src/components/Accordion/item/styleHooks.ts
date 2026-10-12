import { collapsibleOpenStateMapping } from '~@lib/collapsibleOpenStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '~@lib/getStyleHookProps';

import { AccordionItemDataAttributes } from './AccordionItemDataAttributes';

import type { AccordionItem } from './AccordionItem';

export const accordionStyleHookMapping: CustomStyleHookMapping<AccordionItem.State> = {
    ...collapsibleOpenStateMapping,
    index: (value) => {
        return Number.isInteger(value) ? { [AccordionItemDataAttributes.index]: String(value) } : null;
    },
    ...transitionStatusMapping,
    value: () => null
};
