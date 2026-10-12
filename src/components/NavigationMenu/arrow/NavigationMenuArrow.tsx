import React from 'react';

import { AnchorPositioner } from '@flippo-software/core-components/positioning';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPositionerContext } from '../positioner/NavigationMenuPositionerContext';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

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

    const root = useNavigationMenuRoot();
    const { positioner } = useNavigationMenuPositionerContext();

    const arrow = React.useMemo(
        () => ({
            getState: (): NavigationMenuArrow.State => {
                const { side, align, open } = positioner.getState();
                return { open, side, align, uncentered: AnchorPositioner.arrowUncentered(positioner.anchorPositioner.store.state) };
            },
            setElement: (element: Element | null) => positioner.anchorPositioner.setArrow(element)
        }),
        [positioner]
    );
    const state = useMachineState(arrow, [positioner]);
    const track = useTracker();

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, arrow.setElement],
        props: [
            elementProps,
            (props) =>
                track(() =>
                    toReactProps({
                        style: AnchorPositioner.arrowStyles(positioner.anchorPositioner.store.state),
                        'aria-hidden': true,
                        ...props
                    })
                )
        ],
        customStyleHookMapping: popupStateMapping
    });
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
