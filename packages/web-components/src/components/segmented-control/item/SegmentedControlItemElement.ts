import { mergeProps } from '@flippo-software/core-components/props';
import { SegmentedControlItemMachine } from '@flippo-software/core-components/segmented-control';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { SEGMENTED_CONTROL_CONTROL } from '../root/SegmentedControlRootContext';

abstract class SegmentedControlPart extends ContextPart<typeof SEGMENTED_CONTROL_CONTROL> {
    protected readonly contexts = SEGMENTED_CONTROL_CONTROL;
}

/**
 * A button of the segmented control.
 *
 * Attributes: `value` (required), `disabled`.
 * State attributes: `data-selected`, `data-disabled`.
 */
export class SegmentedControlItemElement extends SegmentedControlPart.withAttributes({
    /** The unique value that identifies this item within the group. */
    value: 'string',
    /**
     * Whether this item should ignore user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private item!: SegmentedControlItemMachine;

    protected override createParts() {
        this.item = new SegmentedControlItemMachine(this.provided[0].machine, this.getOptions());
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return this.item.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getProps(), SegmentedControlItemMachine.attrs(this.item.getState()));
    }

    private getOptions() {
        return { value: this.value ?? '', disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
