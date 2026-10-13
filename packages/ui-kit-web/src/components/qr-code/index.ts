import { qrCodeOptions, qrCode as recipe } from '@flippo-software/component-styles/qr-code';
import * as Primitive from '@flippo-software/web-components/qr-code';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const QrCodeElement: StyledConstructor<typeof Primitive.QrCodeElement, typeof recipe> = styled(
    Primitive.QrCodeElement,
    recipe,
    'qr-code',
    'root',
    true,
    undefined,
    { defaults: { options: qrCodeOptions } }
);
export const QrCodeFrameElement: StyledConstructor<typeof Primitive.QrCodeFrameElement, typeof recipe> = styled(
    Primitive.QrCodeFrameElement,
    recipe,
    'qr-code',
    'frame',
    false
);
export const QrCodeOverlayElement: StyledConstructor<typeof Primitive.QrCodeOverlayElement, typeof recipe> = styled(
    Primitive.QrCodeOverlayElement,
    recipe,
    'qr-code',
    'overlay',
    false
);
export const QrCodeGenerateTriggerElement: StyledConstructor<typeof Primitive.QrCodeGenerateTriggerElement, typeof recipe> = styled(
    Primitive.QrCodeGenerateTriggerElement,
    recipe,
    'qr-code',
    'generateTrigger',
    false
);
export const QrCodeDownloadTriggerElement: StyledConstructor<typeof Primitive.QrCodeDownloadTriggerElement, typeof recipe> = styled(
    Primitive.QrCodeDownloadTriggerElement,
    recipe,
    'qr-code',
    'downloadTrigger',
    false
);
export const QrCodeClipboardTriggerElement: StyledConstructor<typeof Primitive.QrCodeClipboardTriggerElement, typeof recipe> = styled(
    Primitive.QrCodeClipboardTriggerElement,
    recipe,
    'qr-code',
    'clipboardTrigger',
    false
);
export const QrCodeActionsElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'qr-code',
    'actions'
);
export const elements: {
    readonly root: typeof QrCodeElement;
    readonly frame: typeof QrCodeFrameElement;
    readonly overlay: typeof QrCodeOverlayElement;
    readonly generateTrigger: typeof QrCodeGenerateTriggerElement;
    readonly downloadTrigger: typeof QrCodeDownloadTriggerElement;
    readonly clipboardTrigger: typeof QrCodeClipboardTriggerElement;
    readonly actions: typeof QrCodeActionsElement;
} = {
    root: QrCodeElement,
    frame: QrCodeFrameElement,
    overlay: QrCodeOverlayElement,
    generateTrigger: QrCodeGenerateTriggerElement,
    downloadTrigger: QrCodeDownloadTriggerElement,
    clipboardTrigger: QrCodeClipboardTriggerElement,
    actions: QrCodeActionsElement
} as const;
export function define(options: DefineOptions) {
    registerElements('qr-code', elements, options);
}
export type QrCodeElement = InstanceType<typeof QrCodeElement>;
export type QrCodeFrameElement = InstanceType<typeof QrCodeFrameElement>;
export type QrCodeOverlayElement = InstanceType<typeof QrCodeOverlayElement>;
export type QrCodeGenerateTriggerElement = InstanceType<typeof QrCodeGenerateTriggerElement>;
export type QrCodeDownloadTriggerElement = InstanceType<typeof QrCodeDownloadTriggerElement>;
export type QrCodeClipboardTriggerElement = InstanceType<typeof QrCodeClipboardTriggerElement>;
export type QrCodeActionsElement = InstanceType<typeof QrCodeActionsElement>;
