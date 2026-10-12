import { PopoverCloseMachine } from '@flippo-software/core-components/popover';

import { toReactProps, useMachine } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

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

    const { store } = usePopoverRootContext();

    const close = useMachine((options) => new PopoverCloseMachine(store, options), { disabled, nativeButton });

    const element = useRenderElement('button', componentProps, {
        ref: [ref, close.setElement],
        props: [elementProps, (props) => toReactProps(close.getCloseProps(props))]
    });

    return element;
}

export type PopoverCloseState = {};

export type PopoverCloseProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', PopoverClose.State>;

export namespace PopoverClose {
    export type State = PopoverCloseState;
    export type Props = PopoverCloseProps;
}
