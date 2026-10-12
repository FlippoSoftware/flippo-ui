import { mergeProps } from '@flippo-software/core-components/props';
import { QrCodeDownloadTriggerMachine } from '@flippo-software/core-components/qr-code';

import type { Props } from '@flippo-software/core-components/props';
import type { QrCodeFileExtension } from '@flippo-software/core-components/qr-code';

import { QrCodePart } from '../root/QrCodeRootContext';

/**
 * A button that downloads the QR code as a file.
 *
 * Attributes: `disabled`, `name` (`qrcode`), `extension` (`svg` by default, `png`, `jpeg`, `webp`).
 * State attributes: `data-downloading`.
 */
export class QrCodeDownloadTriggerElement extends QrCodePart.withAttributes({
    disabled: 'boolean',
    name: 'string',
    extension: ['svg', 'png', 'jpeg', 'webp']
}) {
    private trigger!: QrCodeDownloadTriggerMachine;

    protected override createParts() {
        this.trigger = new QrCodeDownloadTriggerMachine(this.qrCode, this.getOptions());
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
        return mergeProps(
            this.trigger.getProps(),
            this.stateAttributes,
            this.trigger.getState().downloading ? { 'data-downloading': '' } : {}
        );
    }

    private getOptions() {
        return {
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button',
            name: this.name,
            extension: this.extension as QrCodeFileExtension | undefined
        };
    }
}
