
import * as React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
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

    const computedChildren = toast.actionProps?.children ?? elementProps.children;
    const shouldRender = Boolean(computedChildren);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const state: ToastAction.State = React.useMemo(
        () => ({
            type: toast.type
        }),
        [toast.type]
    );

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef],
        state,
        props: [
            elementProps,
            toast.actionProps,
            getButtonProps,
            {
                children: computedChildren
            }
        ]
    });

    if (!shouldRender) {
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
