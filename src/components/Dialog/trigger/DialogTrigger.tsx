import * as React from 'react';

import { CLICK_TRIGGER_IDENTIFIER } from '~@lib/constants';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { useTriggerDataForwarding } from '~@lib/popups';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { useClick, useInteractions } from '~@packages/floating-ui-react';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
import { useDialogRootContext } from '../root/DialogRootContext';

import type { DialogHandle } from '../store/DialogHandle';

/**
 * A button that opens the dialog.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogTrigger(componentProps: DialogTriggerProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        ref,
        id: idProp,
        payload,
        handle,
        ...elementProps
    } = componentProps;

    const dialogRootContext = useDialogRootContext(true);
    const store = handle?.store ?? dialogRootContext?.store;
    if (!store) {
        throw new Error(
            'Base UI: <Dialog.Trigger> must be used within <Dialog.Root> or provided with a handle.'
        );
    }

    const thisTriggerId = useHeadlessUiId(idProp);
    const floatingContext = store.useState('floatingRootContext');
    const isOpenedByThisTrigger = store.useState('isOpenedByTrigger', thisTriggerId);

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);

    const { registerTrigger, isMountedByThisTrigger } = useTriggerDataForwarding(
        thisTriggerId,
        triggerElement,
        store,
        {
            payload
        }
    );

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const click = useClick(floatingContext, { enabled: floatingContext != null });

    const localInteractionProps = useInteractions([click]);

    const state: DialogTrigger.State = React.useMemo(
        () => ({
            disabled,
            open: isOpenedByThisTrigger
        }),
        [disabled, isOpenedByThisTrigger]
    );

    const rootTriggerProps = store.useState('triggerProps', isMountedByThisTrigger);

    return useRenderElement('button', componentProps, {
        state,
        ref: [buttonRef, ref, registerTrigger, setTriggerElement],
        props: [
            localInteractionProps.getReferenceProps(),
            rootTriggerProps,
            { [CLICK_TRIGGER_IDENTIFIER as string]: '', id: thisTriggerId },
            elementProps,
            getButtonProps
        ],
        customStyleHookMapping: triggerOpenStateMapping
    });
}

export type DialogTriggerProps<Payload = unknown> = {
    /**
     * A handle to associate the trigger with a dialog.
     * Can be created with the Dialog.createHandle() method.
     */
    handle?: DialogHandle<Payload>;
    /**
     * A payload to pass to the dialog when it is opened.
     */
    payload?: Payload;
    /**
     * ID of the trigger. In addition to being forwarded to the rendered element,
     * it is also used to specify the active trigger for the dialogs in controlled mode (with the DialogRoot `triggerId` prop).
     */
    id?: string;
} & NativeButtonProps & HeadlessUIComponentProps<'button', DialogTrigger.State>;

export type DialogTriggerState = {
    /**
     * Whether the dialog is currently disabled.
     */
    disabled: boolean;
    /**
     * Whether the dialog is currently open.
     */
    open: boolean;
};

export namespace DialogTrigger {
    export type Props<Payload = unknown> = DialogTriggerProps<Payload>;
    export type State = DialogTriggerState;
}
