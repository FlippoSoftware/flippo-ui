import { SelectList } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { SelectPositionedPart } from '../root/SelectRootContext';

/**
 * The scrollable list of the items, inside the popup (optional: the popup is the list without it).
 */
export class SelectListElement extends SelectPositionedPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.provided?.[0].machine.setListElement(element as HTMLDivElement | null);
    }

    protected override getProps(): Props {
        return SelectList.getProps(this.root, this.positionerElement.machine);
    }
}
