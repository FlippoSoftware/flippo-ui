import React from 'react';

import { useAnimationsFinished } from '@flippo-ui/hooks/use-animations-finished';
import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { adaptiveOrigin } from '~@lib/adaptiveOriginMiddleware';
import { POPUP_COLLISION_AVOIDANCE } from '~@lib/constants';
import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useAnchorPositioning, useRenderElement } from '~@lib/hooks';
import { InternalBackdrop } from '~@lib/InternalBackdrop';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { FloatingNode, useFloatingNodeId } from '~@packages/floating-ui-react';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

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
        render,
        className,
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
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        collisionAvoidance = POPUP_COLLISION_AVOIDANCE,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();
    const keepMounted = usePopoverPortalContext();
    const nodeId = useFloatingNodeId();

    const floatingRootContext = store.useState('floatingRootContext');
    const mounted = store.useState('mounted');
    const open = store.useState('open');
    const openMethod = store.useState('openMethod');
    const openReason = store.useState('openChangeReason');
    const triggerElement = store.useState('activeTriggerElement');
    const modal = store.useState('modal');
    const positionerElement = store.useState('positionerElement');
    const instantType = store.useState('instantType');
    const transitionStatus = store.useState('transitionStatus');

    const prevTriggerElementRef = React.useRef<Element | null>(null);

    const runOnceAnimationsFinish = useAnimationsFinished(positionerElement, false, false);

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
        disableAnchorTracking,
        keepMounted,
        nodeId,
        collisionAvoidance,
        adaptiveOrigin
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

    const domReference = floatingRootContext?.select('domReferenceElement');

    // When the current trigger element changes, enable transitions on the
    // positioner temporarily
    useIsoLayoutEffect(() => {
        const currentTriggerElement = domReference;
        const prevTriggerElement = prevTriggerElementRef.current;

        if (currentTriggerElement) {
            prevTriggerElementRef.current = currentTriggerElement;
        }

        if (
            prevTriggerElement
            && currentTriggerElement
            && currentTriggerElement !== prevTriggerElement
        ) {
            store.set('instantType', undefined);
            const ac = new AbortController();
            runOnceAnimationsFinish(() => {
                store.set('instantType', 'trigger-change');
            }, ac.signal);

            return () => {
                ac.abort();
            };
        }

        return undefined;
    }, [domReference, runOnceAnimationsFinish, store]);

    const state: PopoverPositioner.State = React.useMemo(
        () => ({
            open,
            side: positioner.side,
            align: positioner.align,
            anchorHidden: positioner.anchorHidden,
            instant: instantType
        }),
        [
            open,
            positioner.side,
            positioner.align,
            positioner.anchorHidden,
            instantType
        ]
    );

    const setPositionerElement = React.useCallback(
        (element: HTMLElement | null) => {
            store.set('positionerElement', element);
        },
        [store]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        props: [positioner.props, getDisabledMountTransitionStyles(transitionStatus), elementProps],
        ref: [ref, setPositionerElement],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <PopoverPositionerContext.Provider value={positioner}>
            {mounted
              && modal === true
              && openReason !== REASONS.triggerHover
              && openMethod !== 'touch' && (
                <InternalBackdrop
                  ref={store.context.internalBackdropRef}
                  inert={!open}
                  cutout={triggerElement}
                />
            )}
            <FloatingNode id={nodeId}>{element}</FloatingNode>
        </PopoverPositionerContext.Provider>
    );
}

export type PopoverPositionerState = {
    /**
     * Whether the popover is currently open.
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

export type PopoverPositionerProps = {} & useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', PopoverPositioner.State>;

export namespace PopoverPositioner {
    export type State = PopoverPositionerState;
    export type Props = PopoverPositionerProps;
}
