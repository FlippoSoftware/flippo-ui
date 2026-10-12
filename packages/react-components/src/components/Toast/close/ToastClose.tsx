import React from 'react';

import { ButtonMachine } from '@flippo-software/core-components/button';
import { getToastCloseProps } from '@flippo-software/core-components/toast';

import { toReactProps, useMachine } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useToastContext } from '../provider/ToastProviderContext';
import { useToastRootContext } from '../root/ToastRootContext';

/**
 * Closes the toast when clicked.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastClose(componentProps: ToastClose.Props) {
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

    const { provider } = useToastContext();
    const { toast } = useToastRootContext();

    const button = useMachine((options) => new ButtonMachine(options), { disabled, native: nativeButton });

    const state: ToastClose.State = React.useMemo(() => ({ type: toast.type }), [toast.type]);

    const element = useRenderElement('button', componentProps, {
        ref: [ref, button.setElement],
        state,
        props: [elementProps, (props) => toReactProps(getToastCloseProps(provider, toast as never, button, props))]
    });

    return element;
}

export namespace ToastClose {
    export type State = {
        /**
         * The type of the toast.
         */
        type: string | undefined;
    };

    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
