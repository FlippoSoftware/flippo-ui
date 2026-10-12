import { QrCodeClipboardTriggerMachine } from '@flippo-software/core-components/qr-code';

import type { FileExtension } from 'qr-code-styling';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

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
        disabled,
        extension = 'svg',
        copyAs = 'blob',
        onCopy,
        onCopyError,
        ...elementProps
    } = componentProps;

    const { qrCode } = useQrCodeRootContext();

    const trigger = useMachine((options) => new QrCodeClipboardTriggerMachine(qrCode, options), {
        disabled,
        nativeButton,
        extension,
        copyAs,
        onCopy,
        onCopyError
    });
    const state: QrCodeClipboardTrigger.State = useMachineState(trigger);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.button.setElement],
        props: [elementProps, (props) => toReactProps(trigger.getProps(props))],
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
    } & NativeButtonProps &
        HeadlessUIComponentProps<'button', State>;
}
