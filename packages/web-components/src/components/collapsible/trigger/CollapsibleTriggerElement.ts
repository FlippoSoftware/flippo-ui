import { ButtonMachine } from '@flippo-software/core-components/button';
import { CollapsibleMachine } from '@flippo-software/core-components/collapsible';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { CollapsiblePart } from '../root/CollapsibleRootContext';

/**
 * The button that opens and closes the collapsible.
 *
 * Attributes: `disabled` (defaults to the root's).
 * State attributes: `data-panel-open`, `data-disabled`.
 */
export class CollapsibleTriggerElement extends CollapsiblePart.withAttributes({
    /** Whether the trigger ignores user interaction (the collapsible’s `disabled` by default). */
    disabled: 'boolean'
}) {
    private button!: ButtonMachine;

    protected override createParts() {
        this.button = new ButtonMachine(this.getButtonOptions());
    }

    protected override applyOptions() {
        this.button.setOptions(this.getButtonOptions());
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.button?.setElement(element);
    }

    protected override getProps(): Props {
        const state = this.collapsible.getState();
        return mergeProps(this.collapsible.getTriggerProps(this.button, {}, this.disabledValue), CollapsibleMachine.triggerAttrs(state));
    }

    private get disabledValue(): boolean {
        return this.disabled ?? this.collapsible.getState().disabled;
    }

    private getButtonOptions() {
        return {
            disabled: this.disabledValue,
            focusableWhenDisabled: true,
            native: this.target?.localName === 'button'
        };
    }
}
