import * as React from 'react';

import { CLICK_TRIGGER_IDENTIFIER } from '~@lib/constants';
import { useRenderElement } from '~@lib/hooks';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
import { useDialogRootContext } from '../root/DialogRootContext';

/**
 * A button that opens the dialog.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogTrigger(componentProps: DialogTrigger.Props) {
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

    const { store } = useDialogRootContext();
    const open = store.useState('open');
    const triggerProps = store.useState('triggerProps');

    const state: DialogTrigger.State = React.useMemo(
        () => ({
            disabled,
            open
        }),
        [disabled, open]
    );

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [buttonRef, ref, store.getElementSetter('triggerElement')],
        props: [
            triggerProps,
            { [CLICK_TRIGGER_IDENTIFIER as string]: '' },
            elementProps,
            getButtonProps
        ],
        customStyleHookMapping: triggerOpenStateMapping
    });

    return element;
}

export namespace DialogTrigger {
    export type State = {
        /**
         * Whether the dialog is currently disabled.
         */
        disabled: boolean;
        /**
         * Whether the dialog is currently open.
         */
        open: boolean;
    };

    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
