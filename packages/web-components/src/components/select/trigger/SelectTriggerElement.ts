import { mergeProps } from '@flippo-software/core-components/props';
import { SelectTriggerMachine } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { SelectPart } from '../root/SelectRootContext';

/**
 * The button that opens the list (`role="combobox"`).
 *
 * Attributes: `disabled`.
 * State attributes: `data-popup-open`, `data-disabled`, `data-readonly`, `data-placeholder`, and those of the field.
 */
export class SelectTriggerElement extends SelectPart.withAttributes({
    /** Whether the component should ignore user interaction. */
    disabled: 'boolean'
}) {
    private trigger!: SelectTriggerMachine;

    private readonly generatedId = createId('select-trigger');

    protected override createParts() {
        this.trigger = new SelectTriggerMachine(this.root, this.getOptions());
    }

    protected override applyOptions() {
        this.trigger.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.trigger.afterCommit();
    }

    protected override connectParts() {
        return this.trigger.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.setElement(element);
    }

    protected override getProps(): Props {
        const labelId = this.rootElement.labelableController?.labelId;
        return mergeProps(this.trigger.getTriggerProps({}, labelId), SelectTriggerMachine.attrs(this.trigger.getState()));
    }

    private getOptions() {
        return {
            id: this.targetId(this.generatedId),
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button'
        };
    }
}
