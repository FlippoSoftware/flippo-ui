import React from 'react';

import { NavigationMenuPositionerMachine } from '@flippo-software/core-components/navigation-menu';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side, useAnchorPositioning } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPortalContext } from '../portal/NavigationMenuPortalContext';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

import { NavigationMenuPositionerContext } from './NavigationMenuPositionerContext';

import type { NavigationMenuPositionerContextValue } from './NavigationMenuPositionerContext';

/**
 * Positions the navigation menu against the currently active trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuPositioner(componentProps: NavigationMenuPositionerProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        collisionAvoidance,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        ...elementProps
    } = componentProps;

    const root = useNavigationMenuRoot();
    const keepMounted = useNavigationMenuPortalContext();
    const direction = useDirection();

    const positioner = useMachine((options) => new NavigationMenuPositionerMachine(root, options), {
        anchor,
        positionMethod,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionBoundary,
        collisionPadding,
        collisionAvoidance,
        arrowPadding,
        sticky,
        disableAnchorTracking,
        keepMounted,
        direction
    } as ConstructorParameters<typeof NavigationMenuPositionerMachine>[1]);
    const state: NavigationMenuPositioner.State = useMachineState(positioner, [positioner]);
    const track = useTracker();

    const contextValue: NavigationMenuPositionerContextValue = React.useMemo(() => ({ positioner }), [positioner]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, positioner.setElement],
        props: [elementProps, (props) => track(() => toReactProps(positioner.getPositionerProps(props)))],
        customStyleHookMapping: popupStateMapping
    });

    return <NavigationMenuPositionerContext value={contextValue}>{element}</NavigationMenuPositionerContext>;
}

export type NavigationMenuPositionerState = {
    /**
     * Whether the navigation menu is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    /**
     * Whether CSS transitions should be disabled.
     */
    instant: boolean;
};

export type NavigationMenuPositionerProps = {} & useAnchorPositioning.SharedParameters &
    HeadlessUIComponentProps<'div', NavigationMenuPositioner.State>;

export namespace NavigationMenuPositioner {
    export type State = NavigationMenuPositionerState;
    export type Props = NavigationMenuPositionerProps;
}
