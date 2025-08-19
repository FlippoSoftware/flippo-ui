'use client';

import React from 'react';

import { POPUP_COLLISION_AVOIDANCE } from '@lib/constants';
import { useAnchorPositioning, useRenderElement } from '@lib/hooks';
import { InternalBackdrop } from '@lib/InternalBackdrop';
import { popupStateMapping } from '@lib/popupStateMapping';
import { FloatingNode, useFloatingNodeId } from '@packages/floating-ui-react';

import type { NUseAnchorPositioning, TAlign, TSide } from '@lib/hooks';
import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { usePopoverPortalContext } from '../portal/PopoverPortalContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

import { PopoverPositionerContext } from './PopoverPositionerContext';

/**
 * Positions the popover against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverPositioner(componentProps: PopoverPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding = 5,
        sticky = false,
        trackAnchor = true,
        collisionAvoidance = POPUP_COLLISION_AVOIDANCE,
        ref,
        ...elementProps
    } = componentProps;

    const {
        floatingRootContext,
        open,
        mounted,
        setPositionerElement,
        modal,
        openReason,
        openMethod,
        triggerElement,
        internalBackdropRef
    } = usePopoverRootContext();
    const keepMounted = usePopoverPortalContext();
    const nodeId = useFloatingNodeId();

    const positioning = useAnchorPositioning({
        anchor,
        floatingRootContext,
        positionMethod,
        mounted,
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        trackAnchor,
        keepMounted,
        nodeId,
        collisionAvoidance
    });

    const defaultProps: HTMLProps = React.useMemo(() => {
        const hiddenStyles: React.CSSProperties = {};

        if (!open) {
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
    }, [open, mounted, positioning.positionerStyles]);

    const positioner = React.useMemo(
        () => ({
            props: defaultProps,
            ...positioning
        }),
        [defaultProps, positioning]
    );

    const state: PopoverPositioner.State = React.useMemo(
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

    const element = useRenderElement('div', componentProps, {
        state,
        props: [positioner.props, elementProps],
        ref: [ref, setPositionerElement],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <PopoverPositionerContext value={positioner}>
            {mounted && modal === true && openReason !== 'trigger-hover' && openMethod !== 'touch' && (
                <InternalBackdrop
                    ref={internalBackdropRef}
                    inert={!open}
                    cutout={triggerElement}
                />
            )}
            <FloatingNode id={nodeId}>{element}</FloatingNode>
        </PopoverPositionerContext>
    );
}

export namespace PopoverPositioner {
    export type State = {
        /**
         * Whether the popover is currently open.
         */
        open: boolean;
        side: TSide;
        align: TAlign;
        anchorHidden: boolean;
    };

    export type Props = NUseAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', State>;
}
