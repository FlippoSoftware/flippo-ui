import { QrCodeDownloadTriggerMachine } from '@flippo-software/core-components/qr-code';

import type { FileExtension } from 'qr-code-styling';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

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
        disabled,
        onDownload,
        onDownloadError,
        ...elementProps
    } = componentProps;

    const { qrCode } = useQrCodeRootContext();

    const trigger = useMachine((options) => new QrCodeDownloadTriggerMachine(qrCode, options), {
        disabled,
        nativeButton,
        name,
        extension,
        onDownload,
        onDownloadError
    });
    const state: QrCodeDownloadTrigger.State = useMachineState(trigger);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.button.setElement],
        props: [elementProps, (props) => toReactProps(trigger.getProps(props))],
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
    } & NativeButtonProps &
        HeadlessUIComponentProps<'button', State>;
}
