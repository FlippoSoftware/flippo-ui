import type { Props } from '@flippo-software/core-components/props';

import { SelectItemPart } from '../root/SelectRootContext';

/**
 * The text of an item: when the list opens aligned with the trigger, this text is aligned with the value.
 */
export class SelectItemTextElement extends SelectItemPart.withAttributes({}) {
    protected override createParts() {}

    protected override onTargetChange(element: HTMLElement | null) {
        if (this.provided) {
            this.item.setTextElement(element);
            this.provided[0].textChanged();
        }
    }

    protected override getProps(): Props {
        return {};
    }
}
