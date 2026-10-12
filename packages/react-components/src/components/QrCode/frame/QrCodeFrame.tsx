import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useQrCodeRootContext } from '../root/QrCodeRootContext';
import { qrCodeStyleHookMapping } from '../utils/styleHooks';

import type { QrCodeRoot } from '../root/QrCodeRoot';

/**
 * Container that displays the generated QR code.
 * Renders a `<div>` element by default.
 */
export function QrCodeFrame(componentProps: QrCodeFrame.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { qrCode, qrCodeStyling, status, value } = useQrCodeRootContext();

    // A new ref callback for each generated code appends it to the frame.
    // biome-ignore lint/correctness/useExhaustiveDependencies: `qrCodeStyling` is the code appended.
    const qrCodeContainerRef = React.useCallback((node: HTMLElement | null) => qrCode.setFrameElement(node), [qrCode, qrCodeStyling]);

    const state: QrCodeFrame.State = React.useMemo(
        () => ({
            value,
            status
        }),
        [value, status]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [qrCodeContainerRef, ref],
        props: elementProps,
        customStyleHookMapping: qrCodeStyleHookMapping
    });

    return element;
}

export namespace QrCodeFrame {
    export type State = {
        /**
         * The value of the QR code.
         */
        value: string;
        /**
         * The status of the QR code generation.
         */
        status: QrCodeRoot.State['status'];
    };

    export type Props = HeadlessUIComponentProps<'div', State>;
}
