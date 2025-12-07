import React from 'react';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useDialogRootContext } from '../../Dialog/root/DialogRootContext';
import { useDrawerRootContext } from '../root/DrawerRootContext';

import { DrawerDragDataAttributes } from './DrawerDragDataAttributes';
import { useDrawerGesture } from './useDrawerGesture';

const customStyleHookMapping: StateAttributesMapping<DrawerDrag.State> = {
    ...popupStateMapping,
    dragging(value) {
        return value ? { [DrawerDragDataAttributes.dragging]: '' } : null;
    }
};

/**
 * A visual drag element that can be dragged to open/close the drawer.
 * Renders a `<div>` element.
 */
export function DrawerDrag(componentProps: DrawerDrag.Props) {
    const {
        closeThreshold,
        velocityThreshold,
        scrollLockTimeout,
        onDragEnd,
        onDragMove,
        onDragStart,
        onActiveSnapPointIndexChange,
        ...elementProps
    } = componentProps;

    const { store: drawerStore } = useDrawerRootContext();
    const { store: dialogStore } = useDialogRootContext();

    const isDragging = drawerStore.useState('isDragging');
    const open = dialogStore.useState('open');

    const draggableRef = React.useRef<HTMLElement>(null);

    const popupElement = dialogStore.useState('popupElement');
    const direction = drawerStore.useState('direction');
    const shouldDrag = drawerStore.useState('shouldDrag');
    const snapPoints = drawerStore.useState('snapPoints');
    const activeSnapPointIndex = drawerStore.useState('activeSnapPointIndex');
    const containerRef = drawerStore.useState('containerRef');

    const { gestureProps, gestureOffset, isGesturing } = useDrawerGesture({
        swipeDirection: direction,
        containerRef,
        draggableRef: drawerStore.context.dragRef,
        closeThreshold,
        velocityThreshold,
        scrollLockTimeout,
        enabled: shouldDrag && open,
        snapPoints,
        activeSnapPointIndex,
        panelRef: popupElement,
        onDragEnd(event, details) {
            if (details.shouldClose) {
                dialogStore.setOpen(false, createChangeEventDetails('drag'));
            }

            onDragEnd?.(event, details);
        },
        onDragMove,
        onDragStart,
        onActiveSnapPointIndexChange(index) {
            drawerStore.setActiveSnapPoint(index);
            onActiveSnapPointIndexChange?.(index);
        }
    });

    drawerStore.useSyncedValues({
        dragOffset: gestureOffset,
        isDragging: isGesturing,
        popupStyle: gestureProps.style,
        popupDataAttributes: gestureProps.dataAttributes
    });

    const state: DrawerDrag.State = React.useMemo(
        () => ({
            dragging: isDragging,
            open
        }),
        [isDragging, open]
    );

    const dragProps = React.useMemo(() => {
        return mergeProps({
            onPointerDown: gestureProps.onPointerDown,
            onPointerMove: gestureProps.onPointerMove,
            onPointerUp: gestureProps.onPointerUp
        }, elementProps, {
            'aria-hidden': true
        });
    }, [elementProps, gestureProps.onPointerDown, gestureProps.onPointerMove, gestureProps.onPointerUp]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [drawerStore.context.dragRef, draggableRef],
        props: dragProps,
        customStyleHookMapping
    });

    return element;
}

export namespace DrawerDrag {
    export type State = {
        /**
         * Whether the drawer is currently being dragged.
         */
        dragging: boolean;
        /**
         * Whether the drawer is currently open.
         */
        open: boolean;
    };

    export type Props = {
        /**
         * The threshold for closing the drawer.
         *
         * @default 0.4
         */
        closeThreshold?: number;
        /**
         * The threshold for the velocity of the drag.
         *
         * @default 0.5
         */
        velocityThreshold?: number;
        /**
         * The timeout for the scroll lock.
         *
         * @default 100
         */
        scrollLockTimeout?: number;
        /**
         * The ref to the container element.
         *
         * @default undefined
         */
        containerRef?: React.RefObject<HTMLElement | null>;

        /**
         * The callback function to be called when the drag ends.
         *
         * @default undefined
         */
        onDragEnd?: useDrawerGesture.Params['onDragEnd'];
        /**
         * The callback function to be called when the drag moves.
         *
         * @default undefined
         */
        onDragMove?: useDrawerGesture.Params['onDragMove'];
        /**
         * The callback function to be called when the drag starts.
         *
         * @default undefined
         */
        onDragStart?: useDrawerGesture.Params['onDragStart'];
        /**
         * The callback function to be called when the active snap point index changes.
         *
         * @default undefined
         */
        onActiveSnapPointIndexChange?: useDrawerGesture.Params['onActiveSnapPointIndexChange'];
    } & HeadlessUIComponentProps<'div', State>;
}
