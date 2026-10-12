import { PopoverArrow } from '@flippo-software/core-components/popover';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { PopoverPositionedPart } from '../root/PopoverRootContext';

/**
 * An arrow pointing to the trigger, positioned by the positioner.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-uncentered`.
 */
export class PopoverArrowElement extends PopoverPositionedPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        if (this.positioner) {
            PopoverArrow.setElement(this.positioner, element);
        }
    }

    protected override getProps(): Props {
        return mergeProps(
            PopoverArrow.getProps(this.positioner),
            PopoverArrow.attrs(PopoverArrow.getState(this.root.store, this.positioner))
        );
    }
}
