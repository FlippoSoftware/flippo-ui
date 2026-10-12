import { ComboboxPopupMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPositionedPart } from '../root/ComboboxRootContext';

/**
 * The container of the list.
 *
 * State attributes: `data-open`/`data-closed`, `data-side`, `data-align`, `data-empty`, transition attributes.
 */
export class ComboboxPopupElement extends ComboboxPositionedPart.withAttributes({}) {
    private popup!: ComboboxPopupMachine;

    protected override createParts() {
        this.popup = new ComboboxPopupMachine(this.root, this.positionerElement.machine, {}, null);
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
        this.popup?.setElement(element as HTMLDivElement | null);
    }

    protected override getProps(): Props {
        return mergeProps(this.popup.getPopupProps(), ComboboxPopupMachine.attrs(this.popup.getState()));
    }
}
