import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';

import type { HeadlessUIComponentProps, HTMLProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button';
import { useQrCodeRootContext } from '../root/QrCodeRootContext';
import { qrCodeStyleHookMapping } from '../utils/styleHooks';

import type { QrCodeRoot } from '../root/QrCodeRoot';

export function QrCodeGenerateTrigger(componentProps: QrCodeGenerateTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        nativeButton,
        disabled: disabledProp,
        ...elementProps
    } = componentProps;

    const { status, qrCodeStyling, generateQrCode } = useQrCodeRootContext();

    const disabled = Boolean(status === 'loading' || qrCodeStyling || disabledProp);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const getTriggerProps = React.useCallback(
        (externalProps?: HTMLProps): HTMLProps => {
            return mergeProps(
                {
                    onClick: generateQrCode
                },
                externalProps,
                getButtonProps
            );
        },
        [generateQrCode, getButtonProps]
    );
    const state: QrCodeGenerateTrigger.State = React.useMemo(
        () => ({
            status,
            disabled
        }),
        [status, disabled]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [elementProps, getTriggerProps],
        customStyleHookMapping: qrCodeStyleHookMapping
    });

    return element;
}

export namespace QrCodeGenerateTrigger {
    export type State = {
        status: QrCodeRoot.State['status'];
        disabled: boolean;
    };

    export type Props = {
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
