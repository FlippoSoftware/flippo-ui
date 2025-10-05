
import * as React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
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

    const { close, focused } = useToastContext();
    const { toast } = useToastRootContext();

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const state: ToastClose.State = React.useMemo(
        () => ({
            type: toast.type
        }),
        [toast.type]
    );

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef],
        state,
        props: [{
            'aria-hidden': !focused || undefined,
            onClick() {
                close(toast.id);
            }
        }, elementProps, getButtonProps]
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
