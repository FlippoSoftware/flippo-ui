import { AccordionItemMachine } from '@flippo-software/core-components/accordion';
import { ButtonMachine } from '@flippo-software/core-components/button';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { AccordionItemPart } from '../root/AccordionRootContext';

/**
 * The button that opens and closes the section; the arrow keys move between the triggers.
 *
 * Attributes: `disabled`.
 * State attributes: `data-panel-open`, `data-disabled`, `data-orientation`.
 */
export class AccordionTriggerElement extends AccordionItemPart.withAttributes({
    /** Whether the trigger ignores user interaction (the item’s `disabled` by default). */
    disabled: 'boolean'
}) {
    private button!: ButtonMachine;

    private readonly generatedId = createId('accordion-trigger');

    protected override createParts() {
        this.button = new ButtonMachine(this.getButtonOptions());
    }

    protected override applyOptions() {
        this.button.setOptions(this.getButtonOptions());
        this.item.setTriggerId(this.targetId(this.generatedId));
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.button?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(
            this.item.getTriggerProps(this.button, {}, this.disabled),
            AccordionItemMachine.triggerAttrs(this.item.getState())
        );
    }

    private getButtonOptions() {
        return {
            disabled: this.disabled ?? this.item.collapsible.disabled,
            focusableWhenDisabled: true,
            native: this.target?.localName === 'button'
        };
    }
}
