import { mergeProps } from '@flippo-software/core-components/props';
import { SelectPopupMachine } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { SelectPositionedPart } from '../root/SelectRootContext';

/**
 * The container of the list (`role="listbox"` goes to the list, if any, else to the popup).
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, transition attributes.
 */
export class SelectPopupElement extends SelectPositionedPart.withAttributes({}) {
    private popup!: SelectPopupMachine;

    protected override createParts() {
        // No portal: the popup stays in place, in the top layer.
        this.popup = new SelectPopupMachine(this.root, { positioner: this.positionerElement.machine, portal: null });
    }

    protected override applyOptions() {
        this.popup.setOptions({});
    }

    protected override afterOptions() {
        this.popup.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.popup.connect();
        const detachGuards = this.positionerElement.attachFocusGuards(this.popup.focusManager);
        return () => {
            detachGuards();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.popup?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.popup.getPopupProps(), SelectPopupMachine.attrs(this.popup.getState()));
    }
}
