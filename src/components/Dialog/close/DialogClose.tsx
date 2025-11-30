import React from 'react';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

import { useDialogClose } from './useDialogClose';

/**
 * A button that closes the dialog.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogClose(componentProps: DialogClose.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        ref: refProp,
        ...elementProps
    } = componentProps;

    const { store } = useDialogRootContext();
    const open = store.useState('open');

    const { getRootProps, ref } = useDialogClose({
        disabled,
        open,
        setOpen: store.setOpen,
        nativeButton
    });

    const state: DialogClose.State = React.useMemo(() => ({ disabled }), [disabled]);

    return useRenderElement('button', componentProps, {
        state,
        ref: [refProp, ref],
        props: [elementProps, getRootProps]
    });
}

export namespace DialogClose {
    export type Props = {} & NativeButtonProps & HeadlessUIComponentProps<'button', DialogClose.State>;

    export type State = {
    /**
     * Whether the button is currently disabled.
     */
        disabled: boolean;
    };
}
