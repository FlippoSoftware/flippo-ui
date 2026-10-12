import React from 'react';

import { DialogCloseMachine } from '@flippo-software/core-components/dialog';

import { toReactProps, useMachine } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

/**
 * A button that closes the dialog.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogClose(componentProps: DialogCloseProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { store } = useDialogRootContext();

    const close = useMachine((options) => new DialogCloseMachine(store, options), { disabled, nativeButton });

    const state: DialogClose.State = React.useMemo(() => ({ disabled }), [disabled]);

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, close.setElement],
        props: [elementProps, (props) => toReactProps(close.getCloseProps(props))]
    });
}

export type DialogCloseProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', DialogClose.State>;

export type DialogCloseState = {
    /**
     * Whether the button is currently disabled.
     */
    disabled: boolean;
};

export namespace DialogClose {
    export type Props = DialogCloseProps;
    export type State = DialogCloseState;
}
