import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks';

import type { FileExtension } from 'qr-code-styling';

import { useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';

import type { HeadlessUIComponentProps, HTMLProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button';
import { useQrCodeRootContext } from '../root/QrCodeRootContext';
import { qrCodeStyleHookMapping } from '../utils/styleHooks';

import type { QrCodeRoot } from '../root/QrCodeRoot';

export function QrCodeClipboardTrigger(componentProps: QrCodeClipboardTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        nativeButton,
        disabled: disabledProp,
        extension = 'svg',
        copyAs = 'blob',
        onCopy: onCopyProp,
        onCopyError: onCopyErrorProp,
        ...elementProps
    } = componentProps;

    const onCopy = useEventCallback(onCopyProp);
    const onCopyError = useEventCallback(onCopyErrorProp);

    const { status, value, qrCodeStyling } = useQrCodeRootContext();

    const [isCopying, setIsCopying] = React.useState(false);

    const disabled = Boolean(!qrCodeStyling || disabledProp || isCopying);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const getTriggerProps = React.useCallback(
        (externalProps?: HTMLProps): HTMLProps => {
            return mergeProps(
                {
                    onClick: async () => {
                        if (!qrCodeStyling || isCopying) {
                            return;
                        }

                        setIsCopying(true);

                        try {
                            const data = await qrCodeStyling.getRawData(extension);

                            if (!data) {
                                throw new Error('Failed to get QR code data');
                            }

                            let blob: Blob;

                            if (data instanceof Blob) {
                                blob = data;
                            }
                            else {
                                blob = new Blob([new Uint8Array(data)], {
                                    type: extension === 'svg'
                                        ? 'image/svg+xml'
                                        : `image/${extension}`
                                });
                            }

                            if (copyAs === 'dataUrl') {
                                const reader = new FileReader();
                                reader.readAsDataURL(blob);
                                const dataUrl = await new Promise<string>((resolve, reject) => {
                                    reader.onloadend = () => resolve(reader.result as string);
                                    reader.onerror = reject;
                                });
                                await navigator.clipboard.writeText(dataUrl);
                            }
                            else {
                                if (extension === 'svg') {
                                    const text = await blob.text();
                                    await navigator.clipboard.writeText(text);
                                }
                                else {
                                    await navigator.clipboard.write([
                                        new ClipboardItem({
                                            [blob.type]: blob
                                        })
                                    ]);
                                }
                            }

                            onCopy?.();
                        }
                        catch (error) {
                            onCopyError?.(error);
                        }
                        finally {
                            setIsCopying(false);
                        }
                    }
                },
                externalProps,
                getButtonProps
            );
        },
        [getButtonProps, qrCodeStyling, isCopying, extension, copyAs, onCopy, onCopyError]
    );

    const state: QrCodeClipboardTrigger.State = React.useMemo(
        () => ({
            value,
            status,
            disabled,
            copying: isCopying
        }),
        [value, status, disabled, isCopying]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [elementProps, getTriggerProps],
        customStyleHookMapping: qrCodeStyleHookMapping
    });

    return element;
}

export namespace QrCodeClipboardTrigger {
    export type State = {
        value: string;
        status: QrCodeRoot.State['status'];
        disabled: boolean;
        copying: boolean;
    };

    export type CopyAsMode = 'blob' | 'dataUrl';

    export type Props = {
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;

        /**
         * The extension of the QR code to copy.
         *
         * @default 'svg'
         */
        extension?: FileExtension;

        /**
         * How to copy the QR code to clipboard:
         * - 'blob': Copy as actual data (image for images, SVG text for SVG)
         * - 'dataUrl': Copy as data URL (base64 encoded string)
         *
         * @default 'blob'
         */
        copyAs?: CopyAsMode;

        /**
         * The function to call when the value is copied to clipboard.
         *
         * @default undefined
         */
        onCopy?: () => void;

        /**
         * The function to call when copying to clipboard fails.
         *
         * @default undefined
         */
        onCopyError?: (error: unknown) => void;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
