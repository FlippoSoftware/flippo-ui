import { ButtonMachine } from '@flippo-software/core-components/button';
import { mergeProps } from '@flippo-software/core-components/props';
import { getToastCloseProps } from '@flippo-software/core-components/toast';

import type { Props } from '@flippo-software/core-components/props';

import { ToastPart } from '../root/ToastRootContext';

/**
 * A button that closes the toast.
 *
 * Attributes: `disabled`.
 */
export class ToastCloseElement extends ToastPart.withAttributes({
    disabled: 'boolean'
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
        this.button?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(getToastCloseProps(this.provider, this.toast, this.button), this.typeAttributes);
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, native: this.target?.localName === 'button' };
    }
}
