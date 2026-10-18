import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { MenuRadioGroupMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenuChangeEventDetails } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';
import { MenuRadioGroupContext, type MenuValueChangeDetail } from '../root/MenuRootContext';

/**
 * A group of radio items: one of them is checked.
 *
 * Attributes: `value` (controlled), `default-value`, `disabled`.
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 * State attributes: `data-disabled`.
 */
export class MenuRadioGroupElement extends MachineElement.withAttributes({
    /**
     * The controlled value of the radio item that should be currently selected.
     *
     * To render an uncontrolled radio group, use the `default-value` attribute instead.
     */
    value: 'string',
    /**
     * The uncontrolled value of the radio item that should be initially selected.
     *
     * To render a controlled radio group, use the `value` attribute instead.
     */
    'default-value': 'string',
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private group!: MenuRadioGroupMachine;

    constructor() {
        super();
        declareProvider(this, MenuRadioGroupContext);
    }

    get machine(): MenuRadioGroupMachine {
        return this.group;
    }

    protected override createParts() {
        this.group = new MenuRadioGroupMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.group.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return provideContext(this, MenuRadioGroupContext, this);
    }

    protected override getProps(): Props {
        return mergeProps(this.group.getGroupProps(), getStyleHookProps(this.group.getState()));
    }

    private getOptions() {
        return {
            value: this.value,
            defaultValue: this.defaultValue,
            disabled: this.disabled ?? false,
            onValueChange: (value: unknown, eventDetails: MenuChangeEventDetails) => {
                this.emit(
                    'value-change',
                    { value: value as string, reason: eventDetails.reason } satisfies MenuValueChangeDetail,
                    eventDetails
                );
            }
        };
    }
}
