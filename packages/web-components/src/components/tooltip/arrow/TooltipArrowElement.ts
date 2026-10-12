import { getStyleHookProps, popupStateMapping } from '@flippo-software/core-components/attributes';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { TooltipPositionedPart } from '../root/TooltipRootContext';

/**
 * An arrow pointing to the trigger, positioned by the positioner.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-uncentered`.
 */
export class TooltipArrowElement extends TooltipPositionedPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.positioner?.controller.setArrow(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.positioner.getArrowProps(), getStyleHookProps(this.positioner.getArrowState(), popupStateMapping));
    }
}
