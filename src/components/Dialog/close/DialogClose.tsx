import React from 'react';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button';
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
    const open = store.useState('open');

    function handleClick(event: React.MouseEvent) {
        if (open) {
            store.setOpen(false, createChangeEventDetails(REASONS.closePress, event.nativeEvent));
        }
    }

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const state: DialogClose.State = React.useMemo(() => ({ disabled }), [disabled]);

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [{ onClick: handleClick }, elementProps, getButtonProps]
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
