import { mergeProps } from '@flippo-software/core-components/props';
import { ToolbarButtonMachine, ToolbarMachine } from '@flippo-software/core-components/toolbar';

import type { Props } from '@flippo-software/core-components/props';

import { ToolbarItemPart } from '../root/ToolbarRootContext';

/**
 * A button of the toolbar; it stays focusable while disabled (unless `focusable-when-disabled="false"`).
 *
 * Attributes: `disabled`, `focusable-when-disabled`.
 * State attributes: `data-disabled`, `data-orientation`, `data-focusable`.
 */
export class ToolbarButtonElement extends ToolbarItemPart.withAttributes({}) {
    private item!: ToolbarButtonMachine;

    protected override createParts() {
        this.item = new ToolbarButtonMachine(this.toolbar, this.itemOptions);
    }

    protected override applyOptions() {
        this.item.setOptions(this.itemOptions);
    }

    protected override connectParts() {
        return this.item.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getProps(), ToolbarMachine.attrs(this.item.getState()));
    }
}
