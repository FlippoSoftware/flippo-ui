import { mergeProps } from '@flippo-software/core-components/props';
import { QrCodeClipboardTriggerMachine } from '@flippo-software/core-components/qr-code';

import type { Props } from '@flippo-software/core-components/props';
import type { QrCodeFileExtension } from '@flippo-software/core-components/qr-code';

import { QrCodePart } from '../root/QrCodeRootContext';

/**
 * A button that copies the QR code to the clipboard.
 *
 * Attributes: `disabled`, `extension` (`svg` by default, `png`…), `copy-as` (`blob` by default, `dataUrl`).
 * State attributes: `data-copying`.
 */
export class QrCodeClipboardTriggerElement extends QrCodePart.withAttributes({
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * The extension of the QR code to copy.
     * @default 'svg'
     */
    extension: ['svg', 'png', 'jpeg', 'webp'],
    /**
     * How to copy the QR code to clipboard:
     * - 'blob': Copy as actual data (image for images, SVG text for SVG)
     * - 'dataUrl': Copy as data URL (base64 encoded string)
     * @default 'blob'
     */
    'copy-as': ['blob', 'dataUrl']
}) {
    private trigger!: QrCodeClipboardTriggerMachine;

    protected override createParts() {
        this.trigger = new QrCodeClipboardTriggerMachine(this.qrCode, this.getOptions());
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
        return mergeProps(this.trigger.getProps(), this.stateAttributes, this.trigger.getState().copying ? { 'data-copying': '' } : {});
    }

    private getOptions() {
        return {
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button',
            extension: this.extension as QrCodeFileExtension | undefined,
            copyAs: this.copyAs as 'blob' | 'dataUrl' | undefined
        };
    }
}
