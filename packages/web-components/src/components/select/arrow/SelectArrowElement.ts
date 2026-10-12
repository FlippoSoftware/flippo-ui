import { AnchorPositioner } from '@flippo-software/core-components/positioning';

import type { Props } from '@flippo-software/core-components/props';

import { SelectPositionedPart } from '../root/SelectRootContext';

/**
 * An arrow pointing to the trigger (hidden while the list is aligned with the trigger).
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-uncentered`.
 */
export class SelectArrowElement extends SelectPositionedPart.withAttributes({}) {
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
        const anchorState = positioner.positioner.store.state;
        const { side, align } = positioner.getState();
        return {
            style: AnchorPositioner.arrowStyles(anchorState),
            'aria-hidden': true,
            hidden: positioner.alignItemWithTriggerActive,
            'data-side': side,
            'data-align': align,
            ...(this.root.store.state.open ? { 'data-open': '' } : { 'data-closed': '' }),
            ...(AnchorPositioner.arrowUncentered(anchorState) ? { 'data-uncentered': '' } : {})
        };
    }
}
