import React from 'react';

import { createSelector, ReactStore } from '@flippo-ui/hooks';

import type { DrawerGestureDataAttributes } from './drag/DrawerGestureDataAttributes';
import type { useDrawerGesture } from './drag/useDrawerGesture';

export type DrawerDirection = useDrawerGesture.SwipeDirection;
export type SnapPoint = number | string;

export type State = {
    /**
     * Direction from which the drawer opens.
     */
    direction: DrawerDirection;
    /**
     * Should drag be enabled.
     */
    shouldDrag: boolean;
    /**
     * Is currently being dragged.
     */
    isDragging: boolean;
    /**
     * Current drag offset.
     */
    dragOffset: number;
    /**
     * Snap points for the drawer position.
     */
    snapPoints: SnapPoint[];
    /**
     * Current active snap point index.
     */
    activeSnapPointIndex: number;
    /**
     * Whether to scale the background when drawer is open.
     */
    shouldScaleBackground: boolean;
    /**
     * Background scale amount.
     */
    backgroundScale: number;
    /**
     * Style for the drawer popup.
     */
    popupStyle: React.CSSProperties;
    /**
     * Data attributes for the drawer popup.
     */
    popupDataAttributes: {
        [DrawerGestureDataAttributes.snapPoints]: string | null;
        [DrawerGestureDataAttributes.swipeDirectionRight]: string | null;
        [DrawerGestureDataAttributes.swipeDirectionLeft]: string | null;
        [DrawerGestureDataAttributes.swipeDirectionUp]: string | null;
        [DrawerGestureDataAttributes.swipeDirectionDown]: string | null;
    };

    onPointerDown?: (event: React.PointerEvent) => void;
    onPointerMove?: (event: React.PointerEvent) => void;
    onPointerUp?: (event: React.PointerEvent) => void;

    containerRef?: React.RefObject<HTMLElement | null>;
};

type Context = {
    dragRef: React.RefObject<HTMLElement | null>;

    dragStart?: () => void;
    dragMove?: (offset: number) => void;
    dragEnd?: (open: boolean) => void;
    snapPointChange?: (index: number) => void;
};

const selectors = {
    direction: createSelector((state: State) => state.direction),
    shouldDrag: createSelector((state: State) => state.shouldDrag),
    isDragging: createSelector((state: State) => state.isDragging),
    dragOffset: createSelector((state: State) => state.dragOffset),
    snapPoints: createSelector((state: State) => state.snapPoints),
    activeSnapPointIndex: createSelector((state: State) => state.activeSnapPointIndex),
    shouldScaleBackground: createSelector((state: State) => state.shouldScaleBackground),
    backgroundScale: createSelector((state: State) => state.backgroundScale),
    popupStyle: createSelector((state: State) => state.popupStyle),
    popupDataAttributes: createSelector((state: State) => state.popupDataAttributes),
    onPointerDown: createSelector((state: State) => state.onPointerDown),
    onPointerMove: createSelector((state: State) => state.onPointerMove),
    onPointerUp: createSelector((state: State) => state.onPointerUp),
    containerRef: createSelector((state: State) => state.containerRef)
};

export class DrawerStore extends ReactStore<State, Context, typeof selectors> {
    static create(initialState: State) {
        const context: Context = {
            // eslint-disable-next-line react/no-create-ref
            dragRef: React.createRef<HTMLElement>()
        };

        return new DrawerStore(initialState, context, selectors);
    }

    public setDragOffset = (offset: number) => {
        this.set('dragOffset', offset);
        this.context.dragMove?.(offset);
    };

    public setIsDragging = (isDragging: boolean) => {
        this.set('isDragging', isDragging);
        if (isDragging) {
            this.context.dragStart?.();
        }
    };

    public setActiveSnapPoint = (index: number) => {
        this.set('activeSnapPointIndex', index);
        this.context.snapPointChange?.(index);
    };
}
