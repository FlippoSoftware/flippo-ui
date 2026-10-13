import * as React from 'react';

import { useControlledState } from '../useControlledState';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export type SnapPoint = number | string | null;

export type UseDragGestureOptions = {
    /**
     * Direction from which the drawer opens.
     */
    direction: SwipeDirection;
    /**
     * Whether dragging is enabled.
     */
    enabled: boolean;
    /**
     * Whether the drawer is currently open.
     */
    open: boolean;
    /**
     * Callback when drag starts.
     */
    onDragStart?: () => void;
    /**
     * Callback when drag moves.
     */
    onDragMove?: (offset: number, percentage: number) => void;
    /**
     * Callback when drag ends.
     */
    onDragEnd?: (shouldClose: boolean, velocity: number) => void;
    /**
     * Array of snap points. Can be numbers (pixels) or strings (percentages like "50%").
     * null means fully closed.
     */
    snapPoints?: SnapPoint[];
    /**
     * Current active snap point index.
     */
    activeSnapPointIndex?: number | null;
    onActiveSnapPointIndexChange?: (index: number | null) => void;
    /**
     * Reference to the container element (for calculating snap point positions).
     */
    containerRef?: React.RefObject<HTMLElement | null>;
    /**
     * Threshold for closing the drawer (0-1).
     * @default 0.4
     */
    closeThreshold?: number;
    /**
     * Velocity threshold for closing the drawer (in px/ms).
     * @default 0.5
     */
    velocityThreshold?: number;
};

export type UseDragGestureResult = {
    /**
     * Props to spread on the draggable element.
     */
    dragProps: {
        onPointerDown: (event: React.PointerEvent) => void;
        onPointerMove: (event: React.PointerEvent) => void;
        onPointerUp: (event: React.PointerEvent) => void;
        onPointerCancel: (event: React.PointerEvent) => void;
        style: React.CSSProperties;
    };
    /**
     * Current drag offset in pixels.
     */
    dragOffset: number;
    /**
     * Whether the element is currently being dragged.
     */
    isDragging: boolean;
};

const isVertical = (direction: SwipeDirection) => direction === 'up' || direction === 'down';
const isReverse = (direction: SwipeDirection) => direction === 'up' || direction === 'left';

/**
 * Parse snap point to pixels.
 */
function parseSnapPoint(snapPoint: SnapPoint, containerSize: number): number | null {
    if (snapPoint === null) {
        return null;
    }
    if (typeof snapPoint === 'number') {
        return snapPoint;
    }
    // Parse percentage like "50%"
    const match = snapPoint.match(/^(\d+(?:\.\d+)?)%$/);
    if (match?.[1]) {
        return (containerSize * Number.parseFloat(match[1])) / 100;
    }
    return null;
}

/**
 * Find the closest snap point to the current offset.
 */
function findClosestSnapPoint(
    offset: number,
    snapPoints: number[],
    velocity: number,
    velocityThreshold: number
): number {
    if (snapPoints.length === 0) {
        return 0;
    }

    // If velocity is high, snap to the next point in the direction of movement
    if (Math.abs(velocity) > velocityThreshold) {
        const direction = velocity > 0 ? 1 : -1;
        const nextPoints = direction > 0
            ? snapPoints.filter((p) => p > offset)
            : snapPoints.filter((p) => p < offset);

        if (nextPoints.length > 0) {
            return direction > 0 ? Math.min(...nextPoints) : Math.max(...nextPoints);
        }
    }

    // Otherwise, snap to the closest point
    return snapPoints.reduce((closest, point) => {
        return Math.abs(point - offset) < Math.abs(closest - offset) ? point : closest;
    });
}

export function useDragGesture(options: UseDragGestureOptions): UseDragGestureResult {
    const {
        direction,
        enabled,
        open,
        onDragStart,
        onDragMove,
        onDragEnd,
        snapPoints = [],
        activeSnapPointIndex: activeSnapPointIndexProp,
        onActiveSnapPointIndexChange: onActiveSnapPointIndexChangeProp,
        containerRef,
        closeThreshold = 0.4,
        velocityThreshold = 0.5
    } = options;

    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState(0);

    const dragStateRef = React.useRef({
        startPos: 0,
        currentPos: 0,
        startTime: 0,
        lastTime: 0,
        lastPos: 0,
        pointerId: -1,
        elementSize: 0
    });

    const [activeSnapPointIndex, onActiveSnapPointIndexChange] = useControlledState<number | null>({
        prop: activeSnapPointIndexProp,
        defaultProp: activeSnapPointIndexProp ?? null,
        onChange: onActiveSnapPointIndexChangeProp
    });

    const getPosition = React.useCallback(
        (event: React.PointerEvent) => {
            return isVertical(direction) ? event.clientY : event.clientX;
        },
        [direction]
    );

    const calculateOffset = React.useCallback(
        (currentPos: number, startPos: number) => {
            const delta = currentPos - startPos;
            const multiplier = isReverse(direction) ? -1 : 1;
            return delta * multiplier;
        },
        [direction]
    );

    const handlePointerDown = React.useCallback(
        (event: React.PointerEvent) => {
            if (!enabled || !open) {
                return;
            }

            const target = event.currentTarget as HTMLElement;
            const position = getPosition(event);

            // Capture pointer
            target.setPointerCapture(event.pointerId);

            // Get element size
            const rect = target.getBoundingClientRect();
            const elementSize = isVertical(direction) ? rect.height : rect.width;

            // Initialize drag state
            dragStateRef.current = {
                startPos: position,
                currentPos: position,
                startTime: Date.now(),
                lastTime: Date.now(),
                lastPos: position,
                pointerId: event.pointerId,
                elementSize
            };

            setIsDragging(true);
            onDragStart?.();
        },
        [
            enabled,
            open,
            direction,
            getPosition,
            onDragStart
        ]
    );

    const handlePointerMove = React.useCallback(
        (event: React.PointerEvent) => {
            if (!isDragging || event.pointerId !== dragStateRef.current.pointerId) {
                return;
            }

            const position = getPosition(event);
            const offset = calculateOffset(position, dragStateRef.current.startPos);

            // Only allow dragging in the closing direction
            const clampedOffset = Math.max(0, offset);

            dragStateRef.current.currentPos = position;
            dragStateRef.current.lastTime = Date.now();
            dragStateRef.current.lastPos = position;

            setDragOffset(clampedOffset);

            // Calculate percentage
            const percentage = clampedOffset / dragStateRef.current.elementSize;
            onDragMove?.(clampedOffset, percentage);
        },
        [isDragging, getPosition, calculateOffset, onDragMove]
    );

    const handlePointerEnd = React.useCallback(
        (event: React.PointerEvent) => {
            if (!isDragging || event.pointerId !== dragStateRef.current.pointerId) {
                return;
            }

            const {
                currentPos,
                startPos,
                lastTime,
                elementSize,
                startTime
            } = dragStateRef.current;

            // Calculate velocity (px/ms)
            const timeDelta = lastTime - startTime;
            const positionDelta = calculateOffset(currentPos, startPos);
            const velocity = timeDelta > 0 ? positionDelta / timeDelta : 0;

            // Calculate percentage
            const percentage = positionDelta / elementSize;

            let shouldClose = false;
            let targetSnapPointIndex: number | null = null;

            // Handle snap points
            if (snapPoints.length > 0 && containerRef?.current) {
                const containerSize = isVertical(direction)
                    ? containerRef.current.offsetHeight
                    : containerRef.current.offsetWidth;

                // Parse snap points to pixels (including null which means close)
                const parsedSnapPoints: Array<{ value: number | null; originalIndex: number }> = snapPoints
                    .map((sp, index) => ({
                        value: parseSnapPoint(sp, containerSize),
                        originalIndex: index
                    }));

                // Separate null (close) snap point
                const hasCloseSnapPoint = parsedSnapPoints.some((sp) => sp.value === null);
                const numericSnapPoints = parsedSnapPoints
                    .filter((sp): sp is { value: number; originalIndex: number } => sp.value !== null);

                // Add 0 as the initial open position if not already included
                const hasZero = numericSnapPoints.some((sp) => sp.value === 0);
                if (!hasZero) {
                    numericSnapPoints.unshift({ value: 0, originalIndex: -1 });
                }

                // Sort by value
                numericSnapPoints.sort((a, b) => a.value - b.value);

                // Find closest snap point
                const closestSnapPoint = findClosestSnapPoint(
                    Math.max(0, positionDelta),
                    numericSnapPoints.map((sp) => sp.value),
                    velocity,
                    velocityThreshold
                );

                // Determine if should close
                const maxSnapPoint = Math.max(...numericSnapPoints.map((sp) => sp.value));
                const isPassedThreshold = percentage > closeThreshold || velocity > velocityThreshold;

                // Should close if:
                // 1. There's a null snap point AND user passed the threshold
                // 2. OR user dragged beyond the max snap point with high velocity
                if (hasCloseSnapPoint && isPassedThreshold && positionDelta > maxSnapPoint) {
                    shouldClose = true;
                    targetSnapPointIndex = parsedSnapPoints.find((sp) => sp.value === null)?.originalIndex ?? null;
                }
                else {
                    // Snap to the closest point
                    shouldClose = false;
                    const closestEntry = numericSnapPoints.find((sp) => sp.value === closestSnapPoint);
                    const foundIndex = closestEntry?.originalIndex;

                    // If original index is -1, it means it's the default 0 position (fully open)
                    if (foundIndex === -1 || foundIndex === undefined) {
                        targetSnapPointIndex = activeSnapPointIndex ?? null;
                    }
                    else {
                        targetSnapPointIndex = foundIndex;
                    }
                }

                // Call snap point change callback if it changed
                if (onActiveSnapPointIndexChange && targetSnapPointIndex !== activeSnapPointIndex) {
                    onActiveSnapPointIndexChange(shouldClose ? null : targetSnapPointIndex);
                }
            }
            else {
                // No snap points, use default behavior
                shouldClose = percentage > closeThreshold || velocity > velocityThreshold;
            }

            setIsDragging(false);
            setDragOffset(0);

            onDragEnd?.(shouldClose, velocity);

            const target = event.currentTarget as HTMLElement;
            if (target.hasPointerCapture(event.pointerId)) {
                target.releasePointerCapture(event.pointerId);
            }
        },
        [
            isDragging,
            calculateOffset,
            snapPoints,
            containerRef,
            onDragEnd,
            direction,
            velocityThreshold,
            closeThreshold,
            onActiveSnapPointIndexChange,
            activeSnapPointIndex
        ]
    );

    const handlePointerCancel = React.useCallback(
        (event: React.PointerEvent) => {
            if (!isDragging || event.pointerId !== dragStateRef.current.pointerId) {
                return;
            }

            setIsDragging(false);
            setDragOffset(0);

            onDragEnd?.(false, 0);

            const target = event.currentTarget as HTMLElement;
            if (target.hasPointerCapture(event.pointerId)) {
                target.releasePointerCapture(event.pointerId);
            }
        },
        [isDragging, onDragEnd]
    );

    const dragProps = React.useMemo(
        () => ({
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerEnd,
            onPointerCancel: handlePointerCancel,
            style: {
                touchAction: enabled ? 'none' : undefined,
                userSelect: isDragging ? 'none' : undefined
            } as React.CSSProperties
        }),
        [
            handlePointerDown,
            handlePointerMove,
            handlePointerEnd,
            handlePointerCancel,
            enabled,
            isDragging
        ]
    );

    return {
        dragProps,
        dragOffset,
        isDragging
    };
}
