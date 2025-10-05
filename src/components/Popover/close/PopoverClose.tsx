import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button';
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
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { buttonRef, getButtonProps } = useButton({
        disabled,
        focusableWhenDisabled: false,
        native: nativeButton
    });

    const { setOpen } = usePopoverRootContext();

    const element = useRenderElement('button', componentProps, {
        ref: [ref, buttonRef],
        props: [{
            onClick(event) {
                setOpen(false, createChangeEventDetails('close-press', event.nativeEvent));
            }
        }, elementProps, getButtonProps]
    });

    return element;
}

export namespace PopoverClose {
    export type State = object;

    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
