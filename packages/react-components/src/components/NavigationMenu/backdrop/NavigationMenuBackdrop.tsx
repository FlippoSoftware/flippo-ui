import React from 'react';

import { NavigationMenuParts } from '@flippo-software/core-components/navigation-menu';

import type { TransitionStatus } from '@flippo-software/hooks';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

const stateAttributesMapping: StateAttributesMapping<NavigationMenuBackdrop.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A backdrop for the navigation menu popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuBackdrop(componentProps: NavigationMenuBackdropProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useNavigationMenuRoot();
    const track = useTracker();
    const { open, transitionStatus } = track(() => NavigationMenuParts.getBackdropState(root));

    const state: NavigationMenuBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref,
        props: [elementProps, (props) => track(() => toReactProps(NavigationMenuParts.getBackdropProps(root, props)))],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type NavigationMenuBackdropState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * The transition status of the popup.
     */
    transitionStatus: TransitionStatus;
};

export type NavigationMenuBackdropProps = {} & HeadlessUIComponentProps<'div', NavigationMenuBackdrop.State>;

export namespace NavigationMenuBackdrop {
    export type State = NavigationMenuBackdropState;
    export type Props = NavigationMenuBackdropProps;
}
