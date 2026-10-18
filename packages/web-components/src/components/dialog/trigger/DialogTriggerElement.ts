import { DialogTriggerMachine } from '@flippo-software/core-components/dialog';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { DialogPart } from '../root/DialogRootContext';

/**
 * The button that opens the dialog.
 *
 * Attributes: `disabled`.
 * State attributes: `data-popup-open`, `data-disabled`.
 */
export class DialogTriggerElement extends DialogPart.withAttributes({
    /**
     * Whether the trigger ignores user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private trigger!: DialogTriggerMachine;

    private readonly generatedId = createId('dialog-trigger');

    protected override createParts() {
        this.trigger = new DialogTriggerMachine(this.root.store, this.getOptions());
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
        return mergeProps(this.trigger.getTriggerProps(), DialogTriggerMachine.attrs(this.trigger.getState()));
    }

    private getOptions() {
        return {
            // An id written by the page is kept; otherwise the generated one is used.
            id: this.targetId(this.generatedId),
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button'
        };
    }
}
