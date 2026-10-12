import { ButtonMachine } from '@flippo-software/core-components/button';
import { getComboboxChipRemoveProps } from '@flippo-software/core-components/combobox';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxChipPart } from '../root/ComboboxRootContext';

/**
 * A button that removes the chip's value.
 */
export class ComboboxChipRemoveElement extends ComboboxChipPart.withAttributes({}) {
    private button!: ButtonMachine;

    protected override createParts() {
        this.button = new ButtonMachine({ native: this.target?.localName === 'button' });
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.button?.setElement(element);
    }

    protected override getProps(): Props {
        const [root, chip] = this.provided;
        return getComboboxChipRemoveProps(root.machine, chip.machine.index.state.index, this.button);
    }
}
