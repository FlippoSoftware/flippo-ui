import React from 'react';

import { DialogPopupMachine } from '@flippo-software/core-components/dialog';

import type { DialogPopupOptions } from '@flippo-software/core-components/dialog';
import type { Interaction } from '@flippo-ui/hooks/use-enhanced-click-handler';
import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FocusGuards, useFloatingPortalController } from '~@lib/floating';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useDialogPortalContext } from '../portal/DialogPortalContext';
import { useDialogRootContext } from '../root/DialogRootContext';

import { DialogPopupDataAttributes } from './DialogPopupDataAttributes';

const stateAttributesMapping: StateAttributesMapping<DialogPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping,
    nestedDialogOpen(value) {
        return value ? { [DialogPopupDataAttributes.nestedDialogOpen]: '' } : null;
    }
};

/**
 * A container for the dialog contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogPopup(componentProps: DialogPopupProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        finalFocus,
        initialFocus,
        ref,
        ...elementProps
    } = componentProps;

    const { store } = useDialogRootContext();
    useDialogPortalContext();
    const portal = useFloatingPortalController();

    const popup = useMachine((options) => new DialogPopupMachine(store, options, { portal }), {
        initialFocus,
        finalFocus
    } as DialogPopupOptions);
    const track = useTracker();
    const state: DialogPopup.State = useMachineState(popup);

    const element = useRenderElement('div', componentProps, {
        state,
        props: [elementProps, (props) => track(() => toReactProps(popup.getPopupProps(props)))],
        ref: [ref, popup.setElement],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <FocusGuards store={store} getFocusManager={() => popup.focusManager}>
            {element}
        </FocusGuards>
    );
}

export type DialogPopupProps = {
    /**
     * Determines the element to focus when the dialog is opened.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (first tabbable element or popup).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    initialFocus?: boolean | React.RefObject<HTMLElement | null> | ((openType: Interaction) => boolean | HTMLElement | null | void);
    /**
     * Determines the element to focus when the dialog is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?: boolean | React.RefObject<HTMLElement | null> | ((closeType: Interaction) => boolean | HTMLElement | null | void);
} & HeadlessUIComponentProps<'div', DialogPopup.State>;

export type DialogPopupState = {
    /**
     * Whether the dialog is currently open.
     */
    open: boolean;
    transitionStatus: TransitionStatus;
    /**
     * Whether the dialog is nested within a parent dialog.
     */
    nested: boolean;
    /**
     * Whether the dialog has nested dialogs open.
     */
    nestedDialogOpen: boolean;
};

export namespace DialogPopup {
    export type Props = DialogPopupProps;
    export type State = DialogPopupState;
}
