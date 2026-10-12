import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { ButtonMachine } from '@flippo-software/core-components/button';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { MachineElement } from '../../../lib/MachineElement';

/**
 * A button: keyboard and pointer activation, and a disabled state that may stay focusable. Use it on a native
 * `<button>` with `as-child`, or as the button itself (it gets `role="button"` and a tab stop).
 *
 * Attributes: `disabled`, `focusable-when-disabled`.
 * State attributes: `data-disabled`.
 */
export class ButtonElement extends MachineElement.withAttributes({
    disabled: 'boolean',
    'focusable-when-disabled': 'boolean'
}) {
    private button!: ButtonMachine;

    protected override createParts() {
        this.button = new ButtonMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.button.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.button.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.button.getButtonProps(), getStyleHookProps({ disabled: this.disabled ?? false }));
    }

    private getOptions() {
        return {
            disabled: this.disabled ?? false,
            focusableWhenDisabled: this.focusableWhenDisabled ?? false,
            native: this.target?.localName === 'button'
        };
    }
}
