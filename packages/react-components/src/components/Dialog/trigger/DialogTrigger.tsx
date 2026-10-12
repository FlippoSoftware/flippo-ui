import * as React from 'react';

import { DialogTriggerMachine } from '@flippo-software/core-components/dialog';

import type { DialogHandle } from '@flippo-software/core-components/dialog';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useDialogRootContext } from '../root/DialogRootContext';

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
        throw new Error('Base UI: <Dialog.Trigger> must be used within <Dialog.Root> or provided with a handle.');
    }

    const thisTriggerId = useHeadlessUiId(idProp) as string;

    const trigger = useMachine((options) => new DialogTriggerMachine(store, options), {
        id: thisTriggerId,
        disabled,
        nativeButton,
        payload
    });
    const track = useTracker();
    const state: DialogTrigger.State = useMachineState(trigger);

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.setElement],
        props: [elementProps, (props) => track(() => toReactProps(trigger.getTriggerProps(props)))],
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
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', DialogTrigger.State>;

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
