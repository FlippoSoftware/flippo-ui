import type React from 'react';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { mergeProps } from '~@lib/merge';
import { REASONS } from '~@lib/reason';

import type { HTMLProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';

import type { DialogRoot } from '../root/DialogRoot';

export function useDialogClose(params: useDialogClose.Parameters): useDialogClose.ReturnValue {
    const {
        open,
        setOpen,
        disabled,
        nativeButton
    } = params;

    function handleClick(event: React.MouseEvent) {
        if (open) {
            setOpen(false, createChangeEventDetails(REASONS.closePress, event.nativeEvent));
        }
    }

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const getRootProps = (externalProps: HTMLProps) =>
        mergeProps({ onClick: handleClick }, externalProps, getButtonProps);

    return {
        getRootProps,
        ref: buttonRef
    };
}

export namespace useDialogClose {
    export type Parameters = {
    /**
     * Whether the button is currently disabled.
     */
        disabled: boolean;
        /**
         * Whether the dialog is currently open.
         */
        open: boolean;
        /**
         * Event handler called when the dialog is opened or closed.
         */
        setOpen: (open: boolean, eventDetails: DialogRoot.ChangeEventDetails) => void;
        /**
         * Whether the component renders a native `<button>` element when replacing it
         * via the `render` prop.
         * Set to `false` if the rendered element is not a button (e.g. `<div>`).
         * @default true
         */
        nativeButton: boolean;
    };

    export type ReturnValue = {
    /**
     * Resolver for the root element props.
     */
        getRootProps: (externalProps: React.HTMLAttributes<any>) => React.HTMLAttributes<any>;
        ref: React.Ref<HTMLElement>;
    };
}
