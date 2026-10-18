import { PopoverCloseMachine } from '@flippo-software/core-components/popover';

import type { Props } from '@flippo-software/core-components/props';

import { PopoverPart } from '../root/PopoverRootContext';

/**
 * A button that closes the popover.
 *
 * Attributes: `disabled`.
 */
export class PopoverCloseElement extends PopoverPart.withAttributes({
    /**
     * Whether the button ignores user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private close!: PopoverCloseMachine;

    protected override createParts() {
        this.close = new PopoverCloseMachine(this.root.store, this.getOptions());
    }

    protected override applyOptions() {
        this.close.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.close?.setElement(element);
    }

    protected override getProps(): Props {
        return this.close.getCloseProps();
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
