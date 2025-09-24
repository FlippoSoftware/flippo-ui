'use client';

import React from 'react';

import { POPUP_COLLISION_AVOIDANCE } from '@lib/constants';
import { useRenderElement } from '@lib/hooks';
import { popupStateMapping } from '@lib/popupStateMapping';

import type { TAlign, TSide } from '@lib/hooks';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useTooltipPortalContext } from '../portal/TooltipPortalContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';

import { TooltipPositionerContext } from './TooltipPositionerContext';
import { useTooltipPositioner } from './useTooltipPositioner';

import type { TTooltipPositionerContext } from './TooltipPositionerContext';
import type { UseTooltipPositioner } from './useTooltipPositioner';

/**
 * Positions the tooltip against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tooltip](https://base-ui.com/react/components/tooltip)
 */
export function TooltipPositioner({ ref: forwardedRef, ...componentProps }: TooltipPositioner.Props) {
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
        trackAnchor = true,
        collisionAvoidance = POPUP_COLLISION_AVOIDANCE,
        ...elementProps
    } = componentProps;

    const {
        open,
        setPositionerElement,
        mounted,
        floatingRootContext
    } = useTooltipRootContext();
    const keepMounted = useTooltipPortalContext();

    const positioner = useTooltipPositioner({
        anchor,
        positionMethod,
        floatingRootContext,
        trackAnchor,
        mounted,
        side,
        sideOffset,
        align,
        alignOffset,
        collisionBoundary,
        collisionPadding,
        sticky,
        arrowPadding,
        keepMounted,
        collisionAvoidance
    });

    const state: TooltipPositioner.State = React.useMemo(
        () => ({
            open,
            side: positioner.side,
            align: positioner.align,
            anchorHidden: positioner.anchorHidden
        }),
        [
            open,
            positioner.side,
            positioner.align,
            positioner.anchorHidden
        ]
    );

    const contextValue: TTooltipPositionerContext = React.useMemo(
        () => ({
            ...state,
            arrowRef: positioner.arrowRef,
            arrowStyles: positioner.arrowStyles,
            arrowUncentered: positioner.arrowUncentered
        }),
        [
            state,
            positioner.arrowRef,
            positioner.arrowStyles,
            positioner.arrowUncentered
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        props: [positioner.props, elementProps],
        ref: [forwardedRef, setPositionerElement],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <TooltipPositionerContext value={contextValue}>
            {element}
        </TooltipPositionerContext>
    );
}

export namespace TooltipPositioner {
    export type State = {
        open: boolean;
        side: TSide;
        align: TAlign;
        anchorHidden: boolean;
    };

    export type Props = { ref?: React.Ref<HTMLDivElement> } & HeadlessUIComponentProps<'div', State> & UseTooltipPositioner.SharedParameters;
}
