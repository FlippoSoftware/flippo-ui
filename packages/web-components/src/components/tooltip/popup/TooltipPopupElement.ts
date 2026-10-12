import { mergeProps } from '@flippo-software/core-components/props';
import { TooltipPopupMachine } from '@flippo-software/core-components/tooltip';

import type { Props } from '@flippo-software/core-components/props';

import { TooltipPositionedPart } from '../root/TooltipRootContext';

/**
 * The container of the tooltip's content.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-instant`, transition attributes.
 */
export class TooltipPopupElement extends TooltipPositionedPart.withAttributes({}) {
    private popup!: TooltipPopupMachine;

    protected override createParts() {
        this.popup = new TooltipPopupMachine(this.root, { positioner: this.positioner });
    }

    protected override applyOptions() {}

    protected override connectParts() {
        return this.popup.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.popup?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.popup.getPopupProps(), TooltipPopupMachine.attrs(this.popup.getState()));
    }
}
