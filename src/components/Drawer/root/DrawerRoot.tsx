import React from 'react';

import {
    useEventCallback,
    useLazyRef
} from '@flippo-ui/hooks';

import { mergeProps } from '~@lib/merge';

import { Dialog as DialogHeadless } from '../../Dialog';
import { DrawerGestureDataAttributes } from '../drag/DrawerGestureDataAttributes';
import { DrawerStore } from '../store';

import type { DrawerDirection, SnapPoint } from '../store';

import { DrawerRootContext } from './DrawerRootContext';

import type { DrawerRootContextValue } from './DrawerRootContext';

const INITIAL_STATE = {
    direction: 'down',
    shouldDrag: true,
    isDragging: false,
    dragOffset: 0,
    snapPoints: [] as SnapPoint[],
    activeSnapPointIndex: 0,
    shouldScaleBackground: false,
    backgroundScale: 0.96,
    popupStyle: {},
    popupDataAttributes: {
        [DrawerGestureDataAttributes.snapPoints]: null,
        [DrawerGestureDataAttributes.swipeDirectionRight]: null,
        [DrawerGestureDataAttributes.swipeDirectionLeft]: null,
        [DrawerGestureDataAttributes.swipeDirectionUp]: null,
        [DrawerGestureDataAttributes.swipeDirectionDown]: null
    }
} as const;

/**
 * Groups all parts of the drawer.
 * Doesn't render its own HTML element.
 *
 * Drawer component with drag and drop support inspired by vaul.
 */
export function DrawerRoot(componentProps: DrawerRoot.Props) {
    const {
        direction = 'down',
        shouldDrag = true,
        snapPoints,
        activeSnapPoint,
        onSnapPointChange,
        shouldScaleBackground = false,
        backgroundScale = 0.96,
        onDrag,
        onDragEnd,
        containerRef,
        ...elementProps
    } = componentProps;

    const store = useLazyRef(DrawerStore.create, INITIAL_STATE).current;

    // Initial popupDataAttributes based on direction to ensure CSS selectors work on first render
    const initialPopupDataAttributes = React.useMemo(() => ({
        [DrawerGestureDataAttributes.snapPoints]: snapPoints && snapPoints.length > 0 ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionRight]: direction === 'right' ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionLeft]: direction === 'left' ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionUp]: direction === 'up' ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionDown]: direction === 'down' ? '' : null
    }), [direction, snapPoints]);

    store.useControlledProp('activeSnapPointIndex', activeSnapPoint, 0);
    store.useSyncedValues({
        direction,
        shouldDrag,
        snapPoints,
        shouldScaleBackground,
        backgroundScale,
        containerRef,
        popupDataAttributes: initialPopupDataAttributes
    });
    store.useContextCallback('dragMove', onDrag);
    store.useContextCallback('snapPointChange', onSnapPointChange);

    // Handle drag end with callback
    React.useEffect(() => {
        store.context.dragEnd = (open: boolean) => {
            onDragEnd?.({ open });
        };
    }, [store, onDragEnd]);

    const contextValue = React.useMemo<DrawerRootContextValue>(() => ({ store }), [store]);

    const onOpenChange = useEventCallback((open: boolean) => {
        if (!open) {
            store.setActiveSnapPoint(0);
        }
    });

    const mergedProps = mergeProps<typeof DialogHeadless.Root>(elementProps, { onOpenChange });

    return (
        <DrawerRootContext value={contextValue}>
            <DialogHeadless.Root {...mergedProps} />
        </DrawerRootContext>
    );
}

export namespace DrawerRoot {
    export type Props = {
        /**
         * Direction from which the drawer opens.
         * @default 'down'
         */
        direction?: DrawerDirection;
        /**
         * Whether dragging should be enabled.
         * @default true
         */
        shouldDrag?: boolean;
        /**
         * Array of snap points for the drawer. Can be numbers (pixels) or strings (percentages).
         */
        snapPoints?: SnapPoint[];
        /**
         * Index of the currently active snap point.
         */
        activeSnapPoint?: number;
        /**
         * Event handler called when the active snap point changes.
         */
        onSnapPointChange?: (index: number) => void;
        /**
         * Whether to scale the background when the drawer is open.
         * @default false
         */
        shouldScaleBackground?: boolean;
        /**
         * The scale factor for the background when the drawer is open.
         * @default 0.96
         */
        backgroundScale?: number;
        /**
         * Event handler called during dragging.
         */
        onDrag?: (offset: number) => void;
        /**
         * Event handler called when dragging ends.
         */
        onDragEnd?: (details: { open: boolean }) => void;

        /**
         * The ref to the container element.
         *
         * @default undefined
         */
        containerRef?: React.RefObject<HTMLElement | null>;
    } & DialogHeadless.Root.Props;
}
