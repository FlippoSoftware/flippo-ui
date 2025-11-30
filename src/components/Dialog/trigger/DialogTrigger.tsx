import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { CLICK_TRIGGER_IDENTIFIER } from '~@lib/constants';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { useTriggerRegistration } from '~@lib/popupStoreUtils';
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
export function DialogTrigger(
    componentProps: DialogTrigger.Props
) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        id: idProp,
        payload,
        handle,
        ref,
        ...elementProps

    } = componentProps;

    const dialogRootContext = useDialogRootContext(true);
    const store = handle?.store ?? dialogRootContext?.store;

    if (!store) {
        throw new Error(
            'Headless UI: <Dialog.Trigger> must be used within <Dialog.Root> or provided with a handle.'
        );
    }
    const open = store.useState('open');
    const rootActiveTriggerProps = store.useState('activeTriggerProps');
    const rootInactiveTriggerProps = store.useState('inactiveTriggerProps');
    const activeTrigger = store.useState('activeTriggerElement');
    const floatingContext = store.useState('floatingRootContext');

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
    const isTriggerActive = activeTrigger === triggerElement;

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

    const id = useHeadlessUiId(idProp);
    const registerTrigger = useTriggerRegistration(id, store);

    useIsoLayoutEffect(() => {
        if (isTriggerActive) {
            store.set('payload', payload);
        }
    }, [isTriggerActive, payload, store]);

    const click = useClick(floatingContext, { enabled: floatingContext != null });
    const localInteractionProps = useInteractions([click]);

    return useRenderElement('button', componentProps, {
        state,
        ref: [buttonRef, ref, registerTrigger, setTriggerElement],
        props: [
            localInteractionProps.getReferenceProps(),
            isTriggerActive ? rootActiveTriggerProps : rootInactiveTriggerProps,
            { [CLICK_TRIGGER_IDENTIFIER as string]: '', id },
            elementProps,
            getButtonProps
        ],
        customStyleHookMapping: triggerOpenStateMapping
    });
}

export namespace DialogTrigger {
    export type Props<Payload = unknown> = {
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
}
