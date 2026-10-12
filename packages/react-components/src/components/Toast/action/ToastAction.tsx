import React from 'react';

import { ButtonMachine } from '@flippo-software/core-components/button';
import { getToastActionProps } from '@flippo-software/core-components/toast';

import { toReactProps, useMachine } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useToastRootContext } from '../root/ToastRootContext';

/**
 * Performs an action when clicked.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastAction(componentProps: ToastAction.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { toast } = useToastRootContext();

    const button = useMachine((options) => new ButtonMachine(options), { disabled, native: nativeButton });

    const state: ToastAction.State = React.useMemo(() => ({ type: toast.type }), [toast.type]);

    const element = useRenderElement('button', componentProps, {
        ref: [ref, button.setElement],
        state,
        props: [elementProps, (props) => toReactProps(getToastActionProps(toast as never, button, props))]
    });

    const computedChildren = toast.actionProps?.children ?? elementProps.children;
    if (!computedChildren) {
        return null;
    }

    return element;
}

export namespace ToastAction {
    export type State = {
        /**
         * The type of the toast.
         */
        type: string | undefined;
    };

    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
