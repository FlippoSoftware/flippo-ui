import React from 'react';
import * as ReactDOM from 'react-dom';

import { SelectPopupMachine } from '@flippo-software/core-components/select';

import type { SelectPopupOptions } from '@flippo-software/core-components/select';
import type { Interaction, TransitionStatus } from '@flippo-ui/hooks';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FocusGuards, useFloatingPortalController } from '~@lib/floating';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRoot } from '../root/SelectRootContext';

const _SCROLL_EPS_PX = 1;

const customStyleHookMapping: StateAttributesMapping<SelectPopup.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * A container for the select items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPopup(componentProps: SelectPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        finalFocus,
        ...elementProps
    } = componentProps;

    const root = useSelectRoot();
    const { positioner } = useSelectPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;
    const portal = useFloatingPortalController();

    const popup = useMachine(
        (options) => new SelectPopupMachine(root, { positioner, insideToolbar, flushSync: ReactDOM.flushSync, portal }, options),
        { finalFocus } as SelectPopupOptions
    );
    const state: SelectPopup.State = useMachineState(popup);
    const track = useTracker();

    const element = useRenderElement('div', componentProps, {
        ref: [ref, popup.setElement],
        state,
        customStyleHookMapping,
        props: [elementProps, (props) => track(() => toReactProps(popup.getPopupProps(props)))]
    });

    return (
        <FocusGuards store={root.store} getFocusManager={() => popup.focusManager}>
            {element}
        </FocusGuards>
    );
}

export type SelectPopupProps = {
    children?: React.ReactNode;
    /**
     * Determines the element to focus when the select popup is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?:
        | boolean
        | React.RefObject<HTMLElement | null>
        | ((closeType: Interaction) => boolean | HTMLElement | null | void)
        | undefined;
} & HeadlessUIComponentProps<'div', SelectPopup.State>;

export type SelectPopupState = {
    side: Side | 'none';
    align: Align;
    open: boolean;
    transitionStatus: TransitionStatus;
};

export namespace SelectPopup {
    export type Props = SelectPopupProps;
    export type State = SelectPopupState;
}
