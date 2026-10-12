import { QrCodeGenerateTriggerMachine } from '@flippo-software/core-components/qr-code';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

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
        disabled,
        ...elementProps
    } = componentProps;

    const { qrCode } = useQrCodeRootContext();

    const trigger = useMachine((options) => new QrCodeGenerateTriggerMachine(qrCode, options), { disabled, nativeButton });
    const state: QrCodeGenerateTrigger.State = useMachineState(trigger);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.button.setElement],
        props: [elementProps, (props) => toReactProps(trigger.getProps(props))],
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
    } & NativeButtonProps &
        HeadlessUIComponentProps<'button', State>;
}
