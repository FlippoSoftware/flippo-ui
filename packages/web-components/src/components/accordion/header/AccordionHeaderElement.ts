import { AccordionItemMachine } from '@flippo-software/core-components/accordion';

import type { Props } from '@flippo-software/core-components/props';

import { AccordionItemPart } from '../root/AccordionRootContext';

/**
 * The heading of a section, around its trigger: put it on an `<h3>` (or another heading) with `as-child`.
 *
 * State attributes: those of the item.
 */
export class AccordionHeaderElement extends AccordionItemPart.withAttributes({}) {
    protected override getProps(): Props {
        return AccordionItemMachine.attrs(this.item.getState());
    }
}
