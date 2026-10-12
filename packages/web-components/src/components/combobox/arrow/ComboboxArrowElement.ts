import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPositionedPart } from '../root/ComboboxRootContext';

/**
 * An arrow pointing to the input.
 */
export class ComboboxArrowElement extends ComboboxPositionedPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.provided?.[1].machine?.positioner.setArrow(element);
    }

    protected override getProps(): Props {
        const positioner = this.positionerElement.machine;
        const { side, align } = positioner.getState();
        return { style: positioner.getArrowStyles(), 'aria-hidden': true, 'data-side': side, 'data-align': align };
    }
}
