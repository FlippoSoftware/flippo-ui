import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { QrCodeClipboardTriggerElement } from './clipboard-trigger/QrCodeClipboardTriggerElement';
import { QrCodeDownloadTriggerElement } from './download-trigger/QrCodeDownloadTriggerElement';
import { QrCodeFrameElement } from './frame/QrCodeFrameElement';
import { QrCodeGenerateTriggerElement } from './generate-trigger/QrCodeGenerateTriggerElement';
import { QrCodeOverlayElement } from './overlay/QrCodeOverlayElement';
import { QrCodeElement } from './root/QrCodeElement';

export * from './clipboard-trigger/QrCodeClipboardTriggerElement';
export * from './download-trigger/QrCodeDownloadTriggerElement';
export * from './frame/QrCodeFrameElement';
export * from './generate-trigger/QrCodeGenerateTriggerElement';
export * from './overlay/QrCodeOverlayElement';
export * from './root/QrCodeElement';
export * from './root/QrCodeRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: QrCodeElement,
    frame: QrCodeFrameElement,
    overlay: QrCodeOverlayElement,
    generateTrigger: QrCodeGenerateTriggerElement,
    downloadTrigger: QrCodeDownloadTriggerElement,
    clipboardTrigger: QrCodeClipboardTriggerElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-qr-code…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('qrCode', elements, options);
}
