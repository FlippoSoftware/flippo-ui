import React from 'react';

import { PopoverPopupMachine } from '@flippo-software/core-components/popover';

import type { PopoverPopupOptions } from '@flippo-software/core-components/popover';
import type { Interaction } from '@flippo-ui/hooks/use-enhanced-click-handler';
import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FocusGuards, useFloatingPortalController, useFloatingTree } from '~@lib/floating';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { usePopoverPositionerContext } from '../positioner/PopoverPositionerContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

const stateAttributesMapping: StateAttributesMapping<PopoverPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A container for the popover contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverPopup(componentProps: PopoverPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        initialFocus,
        finalFocus,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();
    const { positioner } = usePopoverPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;
    const direction = useDirection();
    const tree = useFloatingTree();
    const portal = useFloatingPortalController();

    const popup = useMachine((options) => new PopoverPopupMachine(store, { positioner, insideToolbar, direction, tree, portal }, options), {
        initialFocus,
        finalFocus
    } as PopoverPopupOptions);
    const track = useTracker();
    const state: PopoverPopup.State = useMachineState(popup, [positioner.controller]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, popup.setElement],
        props: [elementProps, (props) => track(() => toReactProps(popup.getPopupProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <FocusGuards store={store} getFocusManager={() => popup.focusManager}>
            {element}
        </FocusGuards>
    );
}

export type PopoverPopupState = {
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    transitionStatus: TransitionStatus;
};

export type PopoverPopupProps = {
    /**
     * Determines the element to focus when the popover is opened.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (first tabbable element or popup).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    initialFocus?: boolean | React.RefObject<HTMLElement | null> | ((openType: Interaction) => void | boolean | HTMLElement | null);
    /**
     * Determines the element to focus when the popover is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?: boolean | React.RefObject<HTMLElement | null> | ((closeType: Interaction) => void | boolean | HTMLElement | null);
} & HeadlessUIComponentProps<'div', PopoverPopup.State>;

export namespace PopoverPopup {
    export type State = PopoverPopupState;
    export type Props = PopoverPopupProps;
}
