import type React from 'react';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
import { usePopoverRootContext } from '../root/PopoverRootContext';

/**
 * A button that closes the popover.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverClose(componentProps: PopoverClose.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        disabled,
        nativeButton,
        ...elementProps
    } = componentProps;

    const { buttonRef, getButtonProps } = useButton({
        disabled,
        focusableWhenDisabled: false,
        native: nativeButton
    });

    const { store } = usePopoverRootContext();

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef],
        props: [{
            onClick(event) {
                store.setOpen(
                    false,
                    createChangeEventDetails(REASONS.closePress, event.nativeEvent, event.currentTarget)
                );
            }
        }, elementProps, getButtonProps]
    });

    return element;
}

export type PopoverCloseState = {};

export type PopoverCloseProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', PopoverClose.State>;

export namespace PopoverClose {
    export type State = PopoverCloseState;
    export type Props = PopoverCloseProps;
}
