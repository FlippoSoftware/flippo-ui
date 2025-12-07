import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';
import { useScrollLock } from '@flippo-ui/hooks/use-scroll-lock';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useStore } from '@flippo-ui/hooks/use-store';

import { DROPDOWN_COLLISION_AVOIDANCE } from '~@lib/constants';
import { useAnchorPositioning } from '~@lib/hooks/useAnchorPositioning';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { InternalBackdrop } from '~@lib/InternalBackdrop';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { useComboboxPortalContext } from '../portal/ComboboxPortalContext';
import {
    useComboboxDerivedItemsContext,
    useComboboxFloatingContext,
    useComboboxRootContext
} from '../root/ComboboxRootContext';
import { selectors } from '../store';

import { ComboboxPositionerContext } from './ComboboxPositionerContext';

import type { ComboboxPositionerContextValue } from './ComboboxPositionerContext';

/**
 * Positions the popup against the trigger.
 * Renders a `<div>` element.
 */
export function ComboboxPositioner(componentProps: ComboboxPositioner.Props) {
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
        collisionAvoidance = DROPDOWN_COLLISION_AVOIDANCE,
        ...elementProps
    } = componentProps;

    const store = useComboboxRootContext();
    const { filteredItems } = useComboboxDerivedItemsContext();
    const floatingRootContext = useComboboxFloatingContext();
    const keepMounted = useComboboxPortalContext();

    const modal = useStore(store, selectors.modal);
    const open = useStore(store, selectors.open);
    const mounted = useStore(store, selectors.mounted);
    const openMethod = useStore(store, selectors.openMethod);
    const triggerElement = useStore(store, selectors.triggerElement);
    const inputElement = useStore(store, selectors.inputElement);
    const inputInsidePopup = useStore(store, selectors.inputInsidePopup);

    const empty = filteredItems.length === 0;
    const resolvedAnchor = anchor ?? (inputInsidePopup ? triggerElement : inputElement);

    const positioning = useAnchorPositioning({
        anchor: resolvedAnchor,
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
        collisionAvoidance,
        lazyFlip: true
    });

    useScrollLock(open && modal && openMethod !== 'touch', triggerElement);

    const defaultProps: HTMLProps = React.useMemo(() => {
        const style: React.CSSProperties = {
            ...positioning.positionerStyles
        };

        if (!open) {
            style.pointerEvents = 'none';
        }

        return {
            role: 'presentation',
            hidden: !mounted,
            style
        };
    }, [open, mounted, positioning.positionerStyles]);

    const state: ComboboxPositioner.State = React.useMemo(
        () => ({
            open,
            side: positioning.side,
            align: positioning.align,
            anchorHidden: positioning.anchorHidden,
            empty
        }),
        [
            open,
            positioning.side,
            positioning.align,
            positioning.anchorHidden,
            empty
        ]
    );

    useIsoLayoutEffect(() => {
        store.set('popupSide', positioning.side);
    }, [store, positioning.side]);

    const contextValue: ComboboxPositionerContextValue = React.useMemo(
        () => ({
            side: positioning.side,
            align: positioning.align,
            arrowRef: positioning.arrowRef,
            arrowUncentered: positioning.arrowUncentered,
            arrowStyles: positioning.arrowStyles,
            anchorHidden: positioning.anchorHidden,
            isPositioned: positioning.isPositioned
        }),
        [
            positioning.side,
            positioning.align,
            positioning.arrowRef,
            positioning.arrowUncentered,
            positioning.arrowStyles,
            positioning.anchorHidden,
            positioning.isPositioned
        ]
    );

    const setPositionerElement = useStableCallback((element) => {
        store.set('positionerElement', element);
    });

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, setPositionerElement],
        props: [defaultProps, elementProps],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <ComboboxPositionerContext.Provider value={contextValue}>
            {mounted && modal && (
                <InternalBackdrop inert={!open} cutout={inputElement ?? triggerElement} />
            )}
            {element}
        </ComboboxPositionerContext.Provider>
    );
}

export type ComboboxPositionerState = {
    /**
     * Whether the popup is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    empty: boolean;
};

export type ComboboxPositionerProps = {} & useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', ComboboxPositioner.State>;

export namespace ComboboxPositioner {
    export type State = ComboboxPositionerState;
    export type Props = ComboboxPositionerProps;
}
