import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

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

    const { state } = usePinInputRootContext();

    const element = useRenderElement(
        'div',
        componentProps,
        {
            ref,
            state,
            props: [{
                'role': 'group',
                'aria-label': 'PIN code input',
                'aria-describedby': state.valid === false ? 'pin-input-error' : undefined,
                'aria-invalid': state.valid === false
            }, elementProps],
            customStyleHookMapping: pinInputStyleHookMapping
        }
    );

    return element;
}

export namespace PinInputGroup {
    export type State = PinInputRoot.State;

    export type Props = HeadlessUIComponentProps<'div', State>;
}
