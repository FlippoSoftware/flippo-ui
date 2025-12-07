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

export function QrCodeDownloadTrigger(componentProps: QrCodeDownloadTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        name = 'qrcode',
        extension = 'svg',
        ref,
        nativeButton,
        disabled: disabledProp,
        onDownload: onDownloadProp,
        onDownloadError: onDownloadErrorProp,
        ...elementProps
    } = componentProps;

    const onDownload = useEventCallback(onDownloadProp);
    const onDownloadError = useEventCallback(onDownloadErrorProp);

    const { status, value, qrCodeStyling } = useQrCodeRootContext();

    const [isDownloading, setIsDownloading] = React.useState(false);

    const disabled = Boolean(!qrCodeStyling || disabledProp || isDownloading);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const getTriggerProps = React.useCallback(
        (externalProps?: HTMLProps): HTMLProps => {
            return mergeProps(
                {
                    onClick: async () => {
                        if (!qrCodeStyling || isDownloading) {
                            return;
                        }

                        setIsDownloading(true);

                        try {
                            await qrCodeStyling.download({
                                name,
                                extension
                            });

                            onDownload?.();
                        }
                        catch (error) {
                            onDownloadError?.(error);
                        }
                        finally {
                            setIsDownloading(false);
                        }
                    }
                },
                externalProps,
                getButtonProps
            );
        },
        [getButtonProps, qrCodeStyling, isDownloading, name, extension, onDownload, onDownloadError]
    );
    const state: QrCodeDownloadTrigger.State = React.useMemo(
        () => ({
            value,
            status,
            disabled,
            downloading: isDownloading
        }),
        [value, status, disabled, isDownloading]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [elementProps, getTriggerProps],
        customStyleHookMapping: qrCodeStyleHookMapping
    });

    return element;
}

export namespace QrCodeDownloadTrigger {
    export type State = {
        value: string;
        status: QrCodeRoot.State['status'];
        disabled: boolean;
        downloading: boolean;
    };

    export type Props = {
        /**
         * The name of the QR code to download.
         *
         * @default 'qrcode'
         */
        name?: string;
        /**
         * The extension of the QR code to download.
         *
         * @default 'svg'
         */
        extension?: FileExtension;
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;

        /**
         * The function to call when the QR code is downloaded.
         *
         * @default undefined
         */
        onDownload?: () => void;

        /**
         * The function to call when the QR code download fails.
         *
         * @default undefined
         */
        onDownloadError?: (error: unknown) => void;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
