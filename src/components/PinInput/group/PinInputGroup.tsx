import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePinInputRootContext } from '../root/PinInputRootContext';
import { pinInputStyleHookMapping } from '../utils/styleHooks';

import type { PinInputRoot } from '../root/PinInputRoot';

export function PinInputGroup(componentProps: PinInputGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { pinInput, state } = usePinInputRootContext();

    return useRenderElement('div', componentProps, {
        ref,
        state,
        props: [toReactProps(pinInput.getGroupProps()), elementProps],
        customStyleHookMapping: pinInputStyleHookMapping
    });
}

export namespace PinInputGroup {
    export type State = PinInputRoot.State;

    export type Props = HeadlessUIComponentProps<'div', State>;
}
