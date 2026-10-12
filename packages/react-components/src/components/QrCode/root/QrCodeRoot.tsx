import React from 'react';

import { QrCodeMachine } from '@flippo-software/core-components/qr-code';
import QRCodeStyling from 'qr-code-styling';

import type { QrCodeOptions } from '@flippo-software/core-components/qr-code';
import type { Options } from 'qr-code-styling';

import { EMPTY_OBJECT } from '~@lib/constants';
import { useMachine, useMachineState, useStoreState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { qrCodeStyleHookMapping } from '../utils/styleHooks';

import { QrCodeRootContext } from './QrCodeRootContext';

import type { QrCodeRootContextValue } from './QrCodeRootContext';

const createRenderer: QrCodeOptions<QRCodeStyling>['createRenderer'] = (options) => new QRCodeStyling(options as Options);

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
        value,
        size: sizeProp = 200,
        options: optionsProp = EMPTY_OBJECT as QrCodeRoot.QrCodeGenerationOptions,
        generateOnMount = true,
        onGenerate,
        onError,
        ...elementProps
    } = componentProps;

    const qrCode = useMachine((machineOptions) => new QrCodeMachine<QRCodeStyling>(machineOptions), {
        value,
        size: sizeProp,
        options: optionsProp as QrCodeOptions['options'],
        generateOnMount,
        onGenerate,
        onError,
        createRenderer
    });
    const state: QrCodeRoot.State = useMachineState(qrCode);
    const { error, renderer } = useStoreState(qrCode.store);

    const { width, height } = qrCode.size;

    const contextValue: QrCodeRootContextValue = React.useMemo(
        () => ({
            qrCode,
            value: state.value,
            size: { width, height },
            status: state.status,
            qrCodeStyling: renderer,
            error,
            generateQrCode: qrCode.generate
        }),
        [qrCode, state.value, state.status, width, height, renderer, error]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [qrCode.setRootElement, ref],
        props: elementProps,
        customStyleHookMapping: qrCodeStyleHookMapping
    });

    return <QrCodeRootContext value={contextValue}>{element}</QrCodeRootContext>;
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
        onGenerate?: (qrCodeStyling: QRCodeStyling) => void | Promise<void>;
        /**
         * Callback fired when an error occurs during QR code generation.
         */
        onError?: (error: unknown) => void;
    };
}
