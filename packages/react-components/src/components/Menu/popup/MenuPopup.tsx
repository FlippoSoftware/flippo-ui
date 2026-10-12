import React from 'react';

import { MenuPopupMachine } from '@flippo-software/core-components/menu';

import type { MenuPopupOptions } from '@flippo-software/core-components/menu';
import type { Interaction } from '@flippo-software/hooks/use-enhanced-click-handler';
import type { TransitionStatus } from '@flippo-software/hooks/use-transition-status';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FocusGuards, useFloatingPortalController } from '~@lib/floating';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

const stateAttributesMapping: StateAttributesMapping<MenuPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A container for the menu items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuPopup(componentProps: MenuPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        finalFocus,
        ...elementProps
    } = componentProps;

    const { root, store } = useMenuRootContext();
    const { positioner } = useMenuPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;
    const portal = useFloatingPortalController();

    const popup = useMachine((options) => new MenuPopupMachine(root, { positioner, insideToolbar, portal }, options), {
        finalFocus
    } as MenuPopupOptions);
    const track = useTracker();
    const state: MenuPopup.State = useMachineState(popup, [positioner.controller]);

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

export type MenuPopupProps = {
    children?: React.ReactNode;
    /**
     * @ignore
     */
    id?: string;
    /**
     * Determines the element to focus when the menu is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?: boolean | React.RefObject<HTMLElement | null> | ((closeType: Interaction) => boolean | HTMLElement | null | void);
} & HeadlessUIComponentProps<'div', MenuPopup.State>;

export type MenuPopupState = {
    transitionStatus: TransitionStatus;
    side: Side;
    align: Align;
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
    nested: boolean;
    instant: 'dismiss' | 'click' | 'group' | undefined;
};

export namespace MenuPopup {
    export type Props = MenuPopupProps;
    export type State = MenuPopupState;
}
