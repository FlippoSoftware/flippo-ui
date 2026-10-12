import { PinInputPinMachine } from '@flippo-software/core-components/pin-input';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePinInputRootContext } from '../root/PinInputRootContext';
import { pinInputStyleHookMapping } from '../utils/styleHooks';

import type { PinInputRoot } from '../root/PinInputRoot';

/**
 * A single character of the PIN.
 * Renders an `<input>` element.
 */
export function PinInputPin(componentProps: PinInputPin.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { pinInput, state } = usePinInputRootContext();

    const id = useHeadlessUiId() as string;

    const pin = useMachine((options) => new PinInputPinMachine(pinInput, options), { id });
    const track = useTracker();

    return useRenderElement('input', componentProps, {
        ref: [pin.setElement, ref],
        state,
        props: [elementProps, (props) => track(() => toReactProps(pin.getProps(props)))],
        customStyleHookMapping: pinInputStyleHookMapping
    });
}

export namespace PinInputPin {
    export type State = PinInputRoot.State;

    export type Props = Omit<
        HeadlessUIComponentProps<'input', State>,
        keyof Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof React.HTMLAttributes<HTMLInputElement>>
    >;
}
