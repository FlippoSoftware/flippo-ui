import React from 'react';

import { useEventCallback, useLatestRef } from '@flippo-ui/hooks';
import QRCodeStyling from 'qr-code-styling';

import type { Options } from 'qr-code-styling';

import { EMPTY_OBJECT } from '~@lib/constants';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { qrCodeStyleHookMapping } from '../utils/styleHooks';

import { QrCodeRootContext } from './QrCodeRootContext';

/**
 * Root container for the QR code generator.
 * Renders a `<div>` element by default.
 */
export function QrCodeRoot(componentProps: QrCodeRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        value: valueProps,
        size: sizeProps = 200,
        options: optionsProps = EMPTY_OBJECT as QrCodeRoot.QrCodeGenerationOptions,
        generateOnMount = true,
        onGenerate,
        onError,
        ...elementProps
    } = componentProps;

    const [status, setStatus] = React.useState<QrCodeRoot.State['status']>('idle');
    const [error, setError] = React.useState<unknown>(null);
    const [qrCodeStyling, setQrCodeStyling] = React.useState<QRCodeStyling | null>(null);

    const size = React.useMemo(() => {
        const width = optionsProps.width || sizeProps;
        const height = optionsProps.height || sizeProps;

        return { width, height };
    }, [optionsProps.width, optionsProps.height, sizeProps]);

    const sizeRef = useLatestRef(size);

    const handleRef = useEventCallback((element: HTMLDivElement) => {
        if (!element) {
            return;
        }

        Object.entries({
            '--qr-code-width': `${sizeRef.current.width}px`,
            '--qr-code-height': `${sizeRef.current.height}px`
        }).forEach(([key, value]) => {
            element.style.setProperty(key, value);
        });
    });

    const generateQrCode = React.useCallback(async () => {
        try {
            setStatus('loading');
            setError(null);

            const qrCodeOptions = {
                ...optionsProps,
                width: size.width,
                height: size.height,
                data: valueProps,
                margin: optionsProps.margin || 10,
                qrOptions: {
                    errorCorrectionLevel: optionsProps.qrOptions?.errorCorrectionLevel || 'M',
                    ...optionsProps.qrOptions
                },
                dotsOptions: {
                    color: optionsProps.dotsOptions?.color || '#000000',
                    type: optionsProps.dotsOptions?.type || 'square',
                    ...optionsProps.dotsOptions
                },
                backgroundOptions: {
                    color: optionsProps.backgroundOptions?.color || '#ffffff',
                    ...optionsProps.backgroundOptions
                },
                cornersSquareOptions: {
                    color: optionsProps.cornersSquareOptions?.color || '#000000',
                    type: optionsProps.cornersSquareOptions?.type || 'square',
                    ...optionsProps.cornersSquareOptions
                },
                cornersDotOptions: {
                    color: optionsProps.cornersDotOptions?.color || '#000000',
                    type: optionsProps.cornersDotOptions?.type || 'square',
                    ...optionsProps.cornersDotOptions
                },
                image: optionsProps.image,
                imageOptions: {
                    hideBackgroundDots: optionsProps.imageOptions?.hideBackgroundDots || true,
                    imageSize: optionsProps.imageOptions?.imageSize || 0.4,
                    margin: optionsProps.imageOptions?.margin || 10,
                    ...optionsProps.imageOptions
                }
            };

            const qrCodeStylingInstance = new QRCodeStyling(qrCodeOptions);
            await onGenerate?.(qrCodeStylingInstance);

            setQrCodeStyling(qrCodeStylingInstance);

            setStatus('generated');
        }
        catch (err: unknown) {
            setStatus('error');

            setError(err);
            onError?.(err);
        }
    }, [optionsProps, size.width, size.height, valueProps, onGenerate, onError]);

    // Auto-generate QR code when value changes
    React.useEffect(() => {
        if (generateOnMount) {
            generateQrCode();
        }
    }, [generateOnMount, generateQrCode, valueProps]);

    const state: QrCodeRoot.State = React.useMemo(
        () => ({
            value: valueProps,
            status

        }),
        [valueProps, status]
    );

    const contextValue = React.useMemo(
        () => ({
            value: valueProps,
            size,
            status,
            qrCodeStyling,
            error,
            generateQrCode
        }),
        [
            valueProps,
            size,
            status,
            qrCodeStyling,
            error,
            generateQrCode
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [handleRef, ref],
        props: elementProps,
        customStyleHookMapping: qrCodeStyleHookMapping
    });

    return (
        <QrCodeRootContext value={contextValue}>
            {element}
        </QrCodeRootContext>
    );
}

export namespace QrCodeRoot {
    export type QrCodeGenerationOptions = Options;

    export type State = {
        /**
         * The text or URL being encoded.
         */
        value: string;

        /**
         * The status of the QR code generation.
         */
        status: 'idle' | 'loading' | 'generated' | 'error';
    };

    export type Props = HeadlessUIComponentProps<'div', State> & {
        /**
         * The text or URL to encode in the QR code.
         */
        value: string;
        /**
         * The size (width and height) of the QR code in pixels.
         * @default 200
         */
        size?: number;
        /**
         * Advanced styling and customization options.
         */
        options?: QrCodeGenerationOptions;

        /**
         * Whether to generate the QR code on mount.
         * @default true
         */
        generateOnMount?: boolean;
        /**
         * Callback fired when the QR code is successfully generated.
         */
        onGenerate?: (qrCodeStyling: QRCodeStyling) => void;
        /**
         * Callback fired when an error occurs during QR code generation.
         */
        onError?: (error: unknown) => void;
    };
}
