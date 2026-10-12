import { PopoverTriggerMachine } from '@flippo-software/core-components/popover';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { PopoverPart } from '../root/PopoverRootContext';

/**
 * The button that opens the popover.
 *
 * Attributes: `disabled`, `open-on-hover`, `delay` (ms before opening on hover), `close-delay` (ms before closing).
 * State attributes: `data-popup-open` (`data-pressed` when opened by a press), `data-disabled`.
 */
export class PopoverTriggerElement extends PopoverPart.withAttributes({
    disabled: 'boolean',
    'open-on-hover': 'boolean',
    delay: 'number',
    'close-delay': 'number'
}) {
    private trigger!: PopoverTriggerMachine;

    private readonly generatedId = createId('popover-trigger');

    protected override createParts() {
        this.trigger = new PopoverTriggerMachine(this.root.store, this.getOptions());
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
        return mergeProps(this.trigger.getTriggerProps(), this.trigger.getStateAttributes());
    }

    private getOptions() {
        return {
            // An id written by the page is kept; otherwise the generated one is used.
            id: this.targetId(this.generatedId),
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button',
            openOnHover: this.openOnHover ?? false,
            delay: this.delay,
            closeDelay: this.closeDelay,
            tree: this.root.tree
        };
    }
}
