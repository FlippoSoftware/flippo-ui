import { DialogCloseMachine } from '@flippo-software/core-components/dialog';

import type { Props } from '@flippo-software/core-components/props';

import { DialogPart } from '../root/DialogRootContext';

/**
 * A button that closes the dialog.
 *
 * Attributes: `disabled`.
 */
export class DialogCloseElement extends DialogPart.withAttributes({
    /**
     * Whether the button ignores user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private close!: DialogCloseMachine;

    protected override createParts() {
        this.close = new DialogCloseMachine(this.root.store, this.getOptions());
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
