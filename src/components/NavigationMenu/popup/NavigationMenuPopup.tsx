import React from 'react';

import { NavigationMenuPopup as NavigationMenuPopupCore } from '@flippo-software/core-components/navigation-menu';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPositionerContext } from '../positioner/NavigationMenuPositionerContext';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

const stateAttributesMapping: StateAttributesMapping<NavigationMenuPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A container for the navigation menu contents.
 * Renders a `<nav>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuPopup(componentProps: NavigationMenuPopupProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        id: idProp,
        ...elementProps
    } = componentProps;

    const root = useNavigationMenuRoot();
    const { positioner } = useNavigationMenuPositionerContext();
    const direction = useDirection();
    const id = useHeadlessUiId(idProp) as string;

    const popup = React.useMemo(
        () => ({
            getState: () => NavigationMenuPopupCore.getState(root, positioner),
            setElement: (element: HTMLElement | null) => NavigationMenuPopupCore.setElement(root, element)
        }),
        [root, positioner]
    );
    const state: NavigationMenuPopup.State = useMachineState(popup, [positioner]);
    const track = useTracker();

    return useRenderElement('nav', componentProps, {
        state,
        ref: [ref, popup.setElement],
        props: [elementProps, (props) => track(() => toReactProps(NavigationMenuPopupCore.getProps(id, positioner, direction, props)))],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type NavigationMenuPopupState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * The transition status of the popup.
     */
    transitionStatus: TransitionStatus;
};

export type NavigationMenuPopupProps = {} & HeadlessUIComponentProps<'nav', NavigationMenuPopup.State>;

export namespace NavigationMenuPopup {
    export type State = NavigationMenuPopupState;
    export type Props = NavigationMenuPopupProps;
}
