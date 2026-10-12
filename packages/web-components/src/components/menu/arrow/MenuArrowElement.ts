import { getStyleHookProps, popupStateMapping } from '@flippo-software/core-components/attributes';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { MenuPositionedPart } from '../root/MenuRootContext';

/**
 * An arrow pointing to the trigger, positioned by the positioner.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-uncentered`.
 */
export class MenuArrowElement extends MenuPositionedPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.positionerElement?.machine?.controller.setArrow(element);
    }

    protected override getProps(): Props {
        const { controller } = this.positionerElement.machine;
        const { side, align } = this.positionerElement.machine.getState();
        const state = {
            open: this.root.store.select('open'),
            side,
            align,
            uncentered: controller.isArrowUncentered()
        };
        return mergeProps({ style: controller.getArrowStyles(), 'aria-hidden': true }, getStyleHookProps(state, popupStateMapping));
    }
}
