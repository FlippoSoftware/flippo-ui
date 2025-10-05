import React from 'react';

import { DROPDOWN_COLLISION_AVOIDANCE } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useAnchorPositioning, useRenderElement } from '~@lib/hooks';
import { InternalBackdrop } from '~@lib/InternalBackdrop';
import { popupStateMapping } from '~@lib/popupStateMapping';
import {
    FloatingNode,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useFloatingTree
} from '~@packages/floating-ui-react';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useContextMenuRootContext } from '../../ContextMenu/root/ContextMenuRootContext';
import { useMenuPortalContext } from '../portal/MenuPortalContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import type { MenuRoot } from '../root/MenuRoot';
import type { MenuOpenEventDetails } from '../utils/types';

import { MenuPositionerContext } from './MenuPositionerContext';

import type { MenuPositionerContextValue } from './MenuPositionerContext';

/**
 * Positions the menu popup against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuPositioner(componentProps: MenuPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor: anchorProp,
        positionMethod: positionMethodProp = 'absolute',
        side,
        align: alignProp,
        sideOffset: sideOffsetProp = 0,
        alignOffset: alignOffsetProp = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding = 5,
        sticky = false,
        trackAnchor = true,
        collisionAvoidance = DROPDOWN_COLLISION_AVOIDANCE,
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        setOpen,
        floatingRootContext,
        setPositionerElement,
        itemDomElements,
        itemLabels,
        mounted,
        modal,
        lastOpenChangeReason,
        parent,
        setHoverEnabled,
        triggerElement
    } = useMenuRootContext();

    const keepMounted = useMenuPortalContext();
    const nodeId = useFloatingNodeId();
    const parentNodeId = useFloatingParentNodeId();
    const contextMenuContext = useContextMenuRootContext(true);

    let anchor = anchorProp;
    let sideOffset = sideOffsetProp;
    let alignOffset = alignOffsetProp;
    let align = alignProp;
    if (parent.type === 'context-menu') {
        anchor = parent.context?.anchor ?? anchorProp;
        align = align ?? 'start';
        if (!side && align !== 'center') {
            alignOffset = componentProps.alignOffset ?? 2;
            sideOffset = componentProps.sideOffset ?? -5;
        }
    }

    let computedSide = side;
    let computedAlign = align;
    if (parent.type === 'menu') {
        computedSide = computedSide ?? 'inline-end';
        computedAlign = computedAlign ?? 'start';
    }
    else if (parent.type === 'menubar') {
        computedSide = computedSide ?? 'bottom';
        computedAlign = computedAlign ?? 'start';
    }

    const contextMenu = parent.type === 'context-menu';

    const positioner = useAnchorPositioning({
        anchor,
        floatingRootContext,
        positionMethod: contextMenuContext ? 'fixed' : positionMethodProp,
        mounted,
        side: computedSide,
        sideOffset,
        align: computedAlign,
        alignOffset,
        arrowPadding: contextMenu ? 0 : arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        nodeId,
        keepMounted,
        trackAnchor,
        collisionAvoidance,
        shiftCrossAxis: contextMenu
    });

    const { events: menuEvents } = useFloatingTree()!;

    const positionerProps = React.useMemo(() => {
        const hiddenStyles: React.CSSProperties = {};

        if (!open) {
            hiddenStyles.pointerEvents = 'none';
        }

        return {
            role: 'presentation',
            hidden: !mounted,
            style: {
                ...positioner.positionerStyles,
                ...hiddenStyles
            }
        };
    }, [open, mounted, positioner.positionerStyles]);

    React.useEffect(() => {
        function onMenuOpenChange(details: MenuOpenEventDetails) {
            if (details.open) {
                if (details.parentNodeId === nodeId) {
                    setHoverEnabled(false);
                }
                if (details.nodeId !== nodeId && details.parentNodeId === parentNodeId) {
                    setOpen(false, createChangeEventDetails('sibling-open'));
                }
            }
            else if (details.parentNodeId === nodeId) {
                // Re-enable hover on the parent when a child closes, except when the child
                // closed due to hovering a different sibling item in this parent (sibling-open).
                // Keeping hover disabled in that scenario prevents the parent from closing
                // immediately when the pointer then leaves it.
                if (details.reason !== 'sibling-open') {
                    setHoverEnabled(true);
                }
            }
        }

        menuEvents.on('menuopenchange', onMenuOpenChange);

        return () => {
            menuEvents.off('menuopenchange', onMenuOpenChange);
        };
    }, [
        menuEvents,
        nodeId,
        parentNodeId,
        setOpen,
        setHoverEnabled
    ]);

    React.useEffect(() => {
        if (parentNodeId == null) {
            return undefined;
        }

        function onParentClose(details: MenuOpenEventDetails) {
            if (details.open || details.nodeId !== parentNodeId) {
                return;
            }

            const reason: MenuRoot.ChangeEventReason = details.reason ?? 'sibling-open';
            setOpen(false, createChangeEventDetails(reason));
        }

        menuEvents.on('menuopenchange', onParentClose);

        return () => {
            menuEvents.off('menuopenchange', onParentClose);
        };
    }, [menuEvents, parentNodeId, setOpen]);

    // Close unrelated child submenus when hovering a different item in the parent menu.
    React.useEffect(() => {
        function onItemHover(event: { nodeId: string | undefined; target: Element | null }) {
            // If an item within our parent menu is hovered, and this menu's trigger is not that item,
            // close this submenu. This ensures hovering a different item in the parent closes other branches.
            if (!open || event.nodeId !== parentNodeId) {
                return;
            }

            if (triggerElement && event.target && triggerElement !== event.target) {
                setOpen(false, createChangeEventDetails('sibling-open'));
            }
        }

        menuEvents.on('itemhover', onItemHover);
        return () => {
            menuEvents.off('itemhover', onItemHover);
        };
    }, [
        menuEvents,
        parentNodeId,
        triggerElement,
        open,
        setOpen
    ]);

    React.useEffect(() => {
        const eventDetails: MenuOpenEventDetails = {
            open,
            nodeId,
            parentNodeId,
            reason: lastOpenChangeReason
        };

        menuEvents.emit('menuopenchange', eventDetails);
    }, [
        menuEvents,
        open,
        nodeId,
        parentNodeId,
        lastOpenChangeReason
    ]);

    const state: MenuPositioner.State = React.useMemo(
        () => ({
            open,
            side: positioner.side,
            align: positioner.align,
            anchorHidden: positioner.anchorHidden,
            nested: parent.type === 'menu'
        }),
        [
            open,
            positioner.side,
            positioner.align,
            positioner.anchorHidden,
            parent.type
        ]
    );

    const contextValue: MenuPositionerContextValue = React.useMemo(
        () => ({
            side: positioner.side,
            align: positioner.align,
            arrowRef: positioner.arrowRef,
            arrowUncentered: positioner.arrowUncentered,
            arrowStyles: positioner.arrowStyles,
            floatingContext: positioner.context
        }),
        [
            positioner.side,
            positioner.align,
            positioner.arrowRef,
            positioner.arrowUncentered,
            positioner.arrowStyles,
            positioner.context
        ]
    );

    const element = useRenderElement('div', componentProps, {
        ref: [ref, setPositionerElement],
        state,
        props: {
            ...positionerProps,
            ...elementProps
        },
        customStyleHookMapping: popupStateMapping
    });

    const shouldRenderBackdrop
        = mounted
          && parent.type !== 'menu'
          && ((parent.type !== 'menubar' && modal && lastOpenChangeReason !== 'trigger-hover')
            || (parent.type === 'menubar' && parent.context.modal));

    // cuts a hole in the backdrop to allow pointer interaction with the menubar or dropdown menu trigger element
    let backdropCutout: HTMLElement | null = null;
    if (parent.type === 'menubar') {
        backdropCutout = parent.context.contentElement;
    }
    else if (parent.type === undefined) {
        backdropCutout = triggerElement;
    }

    return (
        <MenuPositionerContext.Provider value={contextValue}>
            {shouldRenderBackdrop && (
                <InternalBackdrop
                    ref={
                        parent.type === 'context-menu' || parent.type === 'nested-context-menu'
                            ? parent.context.internalBackdropRef
                            : null
                    }
                    inert={!open}
                    cutout={backdropCutout}
                />
            )}
            <FloatingNode id={nodeId}>
                <CompositeList elementsRef={itemDomElements} labelsRef={itemLabels}>
                    {element}
                </CompositeList>
            </FloatingNode>
        </MenuPositionerContext.Provider>
    );
}

export namespace MenuPositioner {
    export type State = {
    /**
     * Whether the menu is currently open.
     */
        open: boolean;
        side: Side;
        align: Align;
        anchorHidden: boolean;
        nested: boolean;
    };

    export type Props = useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', State>;
}
