import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPositionerContext } from '../positioner/NavigationMenuPositionerContext';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

/**
 * Displays an element pointing toward the navigation menu's current anchor.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuArrow(componentProps: NavigationMenuArrowProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { open } = useNavigationMenuRootContext();
    const {
        arrowRef,
        side,
        align,
        arrowUncentered,
        arrowStyles
    }
    = useNavigationMenuPositionerContext();

    const state: NavigationMenuArrow.State = React.useMemo(
        () => ({
            open,
            side,
            align,
            uncentered: arrowUncentered
        }),
        [open, side, align, arrowUncentered]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, arrowRef],
        props: [{ 'style': arrowStyles, 'aria-hidden': true }, elementProps],
        customStyleHookMapping: popupStateMapping
    });

    return element;
}

export type NavigationMenuArrowState = {
    /**
     * Whether the popup is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    uncentered: boolean;
};

export type NavigationMenuArrowProps = {} & HeadlessUIComponentProps<'div', NavigationMenuArrow.State>;

export namespace NavigationMenuArrow {
    export type State = NavigationMenuArrowState;
    export type Props = NavigationMenuArrowProps;
}
