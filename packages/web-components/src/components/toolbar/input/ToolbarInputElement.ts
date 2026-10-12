import { mergeProps } from '@flippo-software/core-components/props';
import { ToolbarInputMachine, ToolbarMachine } from '@flippo-software/core-components/toolbar';

import type { Props } from '@flippo-software/core-components/props';

import { ToolbarItemPart } from '../root/ToolbarRootContext';

/**
 * A text input of the toolbar: put it on an `<input>` with `as-child`. The arrow keys move the caret, and leave the
 * input at its ends.
 *
 * Attributes: `disabled`, `focusable-when-disabled`.
 * State attributes: `data-disabled`, `data-orientation`, `data-focusable`.
 */
export class ToolbarInputElement extends ToolbarItemPart.withAttributes({}) {
    private item!: ToolbarInputMachine;

    protected override createParts() {
        this.item = new ToolbarInputMachine(this.toolbar, this.itemOptions);
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
