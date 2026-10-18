import { ComboboxTriggerMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * A button that opens the list.
 *
 * Attributes: `disabled`.
 * State attributes: `data-popup-open`, `data-disabled`, and those of the field.
 */
export class ComboboxTriggerElement extends ComboboxPart.withAttributes({
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private trigger!: ComboboxTriggerMachine;

    protected override createParts() {
        this.trigger = new ComboboxTriggerMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.trigger.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return this.trigger.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.setElement(element);
    }

    protected override getProps(): Props {
        const labelId = this.rootElement.labelableController?.labelId;
        return mergeProps(this.trigger.getTriggerProps({}, labelId), ComboboxTriggerMachine.attrs(this.trigger.getState()));
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
