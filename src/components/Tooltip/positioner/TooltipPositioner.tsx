import React from 'react';

import { adaptiveOrigin } from '~@lib/adaptiveOriginMiddleware';
import { POPUP_COLLISION_AVOIDANCE } from '~@lib/constants';
import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useAnchorPositioning, useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { useTooltipPortalContext } from '../portal/TooltipPortalContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';

import { TooltipPositionerContext } from './TooltipPositionerContext';

import type { TooltipPositionerContextValue } from './TooltipPositionerContext';

/**
 * Positions the tooltip against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tooltip](https://base-ui.com/react/components/tooltip)
 */
export function TooltipPositioner(componentProps: TooltipPositionerProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor,
        positionMethod = 'absolute',
        side = 'top',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        collisionAvoidance = POPUP_COLLISION_AVOIDANCE,
        ref,
        ...elementProps
    } = componentProps;

    const store = useTooltipRootContext();
    const keepMounted = useTooltipPortalContext();

    const open = store.useState('open');
    const mounted = store.useState('mounted');
    const trackCursorAxis = store.useState('trackCursorAxis');
    const disableHoverablePopup = store.useState('disableHoverablePopup');
    const floatingRootContext = store.useState('floatingRootContext');
    const instantType = store.useState('instantType');
    const transitionStatus = store.useState('transitionStatus');

    const positioning = useAnchorPositioning({
        anchor,
        positionMethod,
        floatingRootContext,
        mounted,
        side,
        sideOffset,
        align,
        alignOffset,
        collisionBoundary,
        collisionPadding,
        sticky,
        arrowPadding,
        disableAnchorTracking,
        keepMounted,
        collisionAvoidance,
        adaptiveOrigin
    });

    const defaultProps: HTMLProps = React.useMemo(() => {
        const hiddenStyles: React.CSSProperties = {};

        if (!open || trackCursorAxis === 'both' || disableHoverablePopup) {
            hiddenStyles.pointerEvents = 'none';
        }

        return {
            role: 'presentation',
            hidden: !mounted,
            style: {
                ...positioning.positionerStyles,
                ...hiddenStyles
            }
        };
    }, [
        open,
        trackCursorAxis,
        disableHoverablePopup,
        mounted,
        positioning.positionerStyles
    ]);

    const state: TooltipPositioner.State = React.useMemo(
        () => ({
            open,
            side: positioning.side,
            align: positioning.align,
            anchorHidden: positioning.anchorHidden,
            instant: trackCursorAxis !== 'none' ? 'tracking-cursor' : instantType
        }),
        [
            open,
            positioning.side,
            positioning.align,
            positioning.anchorHidden,
            trackCursorAxis,
            instantType
        ]
    );

    const contextValue: TooltipPositionerContextValue = React.useMemo(
        () => ({
            ...state,
            arrowRef: positioning.arrowRef,
            arrowStyles: positioning.arrowStyles,
            arrowUncentered: positioning.arrowUncentered
        }),
        [state, positioning.arrowRef, positioning.arrowStyles, positioning.arrowUncentered]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        props: [defaultProps, getDisabledMountTransitionStyles(transitionStatus), elementProps],
        ref: [ref, store.useStateSetter('positionerElement')],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <TooltipPositionerContext.Provider value={contextValue}>
            {element}
        </TooltipPositionerContext.Provider>
    );
}

export type TooltipPositionerState = {
    /**
     * Whether the tooltip is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    /**
     * Whether CSS transitions should be disabled.
     */
    instant: string | undefined;
};

export type TooltipPositionerProps = {
    /**
     * Which side of the anchor element to align the popup against.
     * May automatically change to avoid collisions.
     * @default 'top'
     */
    side?: Side;
} & HeadlessUIComponentProps<'div', TooltipPositioner.State> & Omit<useAnchorPositioning.SharedParameters, 'side'>;

export namespace TooltipPositioner {
    export type State = TooltipPositionerState;
    export type Props = TooltipPositionerProps;
}
