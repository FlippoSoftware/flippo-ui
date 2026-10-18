import { mergeProps } from '@flippo-software/core-components/props';
import { QrCodeGenerateTriggerMachine } from '@flippo-software/core-components/qr-code';

import type { Props } from '@flippo-software/core-components/props';

import { QrCodePart } from '../root/QrCodeRootContext';

/**
 * A button that draws the QR code (again).
 *
 * Attributes: `disabled`.
 */
export class QrCodeGenerateTriggerElement extends QrCodePart.withAttributes({
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private trigger!: QrCodeGenerateTriggerMachine;

    protected override createParts() {
        this.trigger = new QrCodeGenerateTriggerMachine(this.qrCode, this.getOptions());
    }

    protected override applyOptions() {
        this.trigger.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.button.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.trigger.getProps(), this.stateAttributes);
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
