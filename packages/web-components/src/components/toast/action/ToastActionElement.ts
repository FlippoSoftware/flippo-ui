import { ButtonMachine } from '@flippo-software/core-components/button';
import { mergeProps } from '@flippo-software/core-components/props';
import { getToastActionProps } from '@flippo-software/core-components/toast';

import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { ToastPart } from '../root/ToastRootContext';

/**
 * A button of the toast: its `actionProps` (e.g. `onClick`, `children` as its text). Hidden without text.
 *
 * Attributes: `disabled`.
 */
export class ToastActionElement extends ToastPart.withAttributes({
    disabled: 'boolean'
}) {
    private button!: ButtonMachine;

    private readonly text = new FallbackText(this);

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
        const { toast } = this;
        const label = toast.actionProps?.children;
        this.text.set(typeof label === 'string' ? label : undefined);
        const hidden = !label && (this.textContent ?? '').trim() === '';
        const { children: _children, ...actionProps } = toast.actionProps ?? {};
        return mergeProps(getToastActionProps({ ...toast, actionProps }, this.button), this.typeAttributes, { hidden });
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, native: this.target?.localName === 'button' };
    }
}
