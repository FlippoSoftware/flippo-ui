import React from 'react';

import { useControlledState } from '@flippo-ui/hooks/use-controlled-state';
import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { contains, getTarget } from '~@packages/floating-ui-react/utils';

import { DrawerGestureCssVars } from './DrawerGestureCssVars';
import { DrawerGestureDataAttributes } from './DrawerGestureDataAttributes';

const SWIPE_THRESHOLD = 40;
const REVERSE_CANCEL_THRESHOLD = 10;
const MIN_DRAG_THRESHOLD = 1;
const VELOCITY_FOR_FORCED_CLOSE = 2;
const FORCED_CLOSE_THRESHOLD = 0.4;

const DEFAULT_CLOSE_THRESHOLD = 0.4;
const DEFAULT_VELOCITY_THRESHOLD = 0.5;
const DEFAULT_SCROLL_LOCK_TIMEOUT = 100;
const DEFAULT_DAMPING_FACTOR = 0.5;

function getDisplacement(
    direction: 'up' | 'down' | 'left' | 'right',
    deltaX: number,
    deltaY: number
) {
    switch (direction) {
        case 'up':
            return -deltaY;
        case 'down':
            return deltaY;
        case 'left':
            return -deltaX;
        case 'right':
            return deltaX;
        default:
            return 0;
    }
}

const isVertical = (direction: useDrawerGesture.SwipeDirection) => direction === 'up' || direction === 'down';

/**
 * Parse snap point to pixels.
 */
function parseSnapPoint(snapPoint: useDrawerGesture.SnapPoint, containerSize: number): number {
    if (snapPoint === null) {
        return 0;
    }

    if (typeof snapPoint === 'number') {
        return snapPoint;
    }

    // Parse percentage like "50%"
    const match = snapPoint.match(/^(\d+(?:\.\d+)?)%$/);
    if (match?.[1]) {
        return (containerSize * Number.parseFloat(match[1])) / 100;
    }

    return 0;
}

/**
 * Find the closest snap point to the current offset.
 */
function findClosestSnapPoint(
    offset: number,
    zones: number[]
): number {
    return zones.reduce((closest, point) => {
        if (typeof closest !== 'number' || typeof offset !== 'number')
            return closest;

        return Math.abs(point - offset) < Math.abs(closest - offset) ? point : closest;
    });
}

function isCloseDirection({ direction, deltaAxis }: { direction: useDrawerGesture.SwipeDirection; deltaAxis: number }) {
    return (deltaAxis > 0 && (direction === 'down' || direction === 'right')) || (deltaAxis < 0 && (direction === 'up' || direction === 'left'));
}

export function getDrawerDataAttributes(snapPoints: boolean, swipeDirection: useDrawerGesture.SwipeDirection) {
    return {
        [DrawerGestureDataAttributes.snapPoints]: snapPoints ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionRight]: swipeDirection === 'right' ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionLeft]: swipeDirection === 'left' ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionUp]: swipeDirection === 'up' ? '' : null,
        [DrawerGestureDataAttributes.swipeDirectionDown]: swipeDirection === 'down' ? '' : null
    };
}

export function useDrawerGesture(params: useDrawerGesture.Params): useDrawerGesture.ReturnType {
    const {
        swipeDirection,
        enabled = true,
        onDragStart,
        onDragMove,
        onDragEnd,
        snapPoints = [],
        activeSnapPointIndex: activeSnapPointIndexProp,
        onActiveSnapPointIndexChange: onActiveSnapPointIndexChangeProp,
        containerRef,
        draggableRef,
        panelRef,
        closeThreshold: closeThresholdProp = DEFAULT_CLOSE_THRESHOLD,
        velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
        scrollLockTimeout = DEFAULT_SCROLL_LOCK_TIMEOUT,
        dampingFactor = DEFAULT_DAMPING_FACTOR
    } = params;

    const panel = panelRef && 'current' in panelRef ? panelRef.current : panelRef;
    const isVerticalSwipe = isVertical(swipeDirection);

    const [activeSnapPointIndex, onActiveSnapPointIndexChange] = useControlledState({
        prop: activeSnapPointIndexProp,
        defaultProp: 0,
        onChange: onActiveSnapPointIndexChangeProp
    });

    const [isSwiping, setIsSwiping] = React.useState(false);
    const [isRealSwipe, setIsRealSwipe] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

    const dragStartPosRef = React.useRef({ x: 0, y: 0 });
    const panelStartPosRef = React.useRef({ x: 0, y: 0 });
    const intendedSwipeDirectionRef = React.useRef<'up' | 'down' | 'left' | 'right' | undefined>(
        undefined
    );
    const maxSwipeDisplacementRef = React.useRef(0);
    const cancelledSwipeRef = React.useRef(false);
    const swipeCancelBaselineRef = React.useRef({ x: 0, y: 0 });
    const isFirstPointerMoveRef = React.useRef(false);
    const startTimeRef = React.useRef<number | null>(null);
    const lastTimeDragPreventedRef = React.useRef<number | null>(null);

    const [windowDimensions, setWindowDimensions] = React.useState(
        typeof window !== 'undefined'
            ? {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight
            }
            : undefined
    );

    const {
        containerSize,
        maxSnapPoint,
        snapPointsOffset
    } = React.useMemo(() => {
        const container = containerRef?.current;

        const containerSize = container
            ? { width: container.getBoundingClientRect().width, height: container.getBoundingClientRect().height }
            : typeof windowDimensions !== 'undefined'
                ? { width: windowDimensions.innerWidth, height: windowDimensions.innerHeight }
                : { width: 0, height: 0 };

        const containerSizeAxis = isVertical(swipeDirection) ? containerSize.height : containerSize.width;

        const snapPointsAxis = snapPoints.map((snapPoint) =>
            parseSnapPoint(snapPoint, containerSizeAxis)).sort((a, b) => a - b);

        const maxSnapPoint = Math.max(...snapPointsAxis.map((snapPoint) => Math.abs(snapPoint)));

        const snapPointsOffset = snapPointsAxis.reduce<number[]>((acc, snapPoint) => {
            acc.push(swipeDirection === 'down' || swipeDirection === 'right' ? maxSnapPoint - snapPoint : -maxSnapPoint + snapPoint);

            return acc;
        }, []);

        return {
            containerSize,
            maxSnapPoint,
            snapPointsOffset,
            snapPointsAxis
        };
    }, [containerRef, windowDimensions, snapPoints, swipeDirection]);

    const closeThreshold = React.useMemo(() => {
        if (closeThresholdProp < 1 && closeThresholdProp > 0) {
            const panelSize = panel?.getBoundingClientRect() ?? { width: containerSize.width, height: containerSize.height };
            const panelSizeValue = isVerticalSwipe ? panelSize.height : panelSize.width;

            return panelSizeValue * closeThresholdProp;
        }

        return closeThresholdProp;
    }, [
        closeThresholdProp,
        containerSize.height,
        containerSize.width,
        isVerticalSwipe,
        panel
    ]);

    useIsoLayoutEffect(() => {
        if (!window)
            return;

        function onResize() {
            setWindowDimensions({
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight
            });
        }
        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    function applyDamping(overshoot: number) {
        let newOvershoot = overshoot;

        if ((swipeDirection !== 'down' && swipeDirection !== 'right') && overshoot > 0) {
            newOvershoot = overshoot ** dampingFactor;
        }
        if ((swipeDirection !== 'up' && swipeDirection !== 'left') && overshoot < 0) {
            newOvershoot = -(Math.abs(overshoot) ** dampingFactor);
        }

        return newOvershoot;
    }

    const snapToPoint = React.useCallback((translateValue: number) => {
        const newIndex = snapPointsOffset.findIndex((offset) => offset === translateValue);
        if (newIndex !== -1 && newIndex !== activeSnapPointIndex) {
            onActiveSnapPointIndexChange(newIndex);
        }

        // set(panel, {
        //     transition: `transform ${300}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        //     transform: axis === 'vertical' ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        // });
    }, [snapPointsOffset, activeSnapPointIndex, onActiveSnapPointIndexChange]);

    function handlePointerDown(event: React.PointerEvent) {
        if (event.button !== 0 || !enabled) {
            return;
        }

        let target = getTarget(event.nativeEvent) as HTMLElement | null;

        const isInteractiveElement = target
            ? target.closest('button,a,input,textarea,[role="button"],[data-swipe-ignore]')
            : false;

        if (isInteractiveElement) {
            return;
        }

        const currentTime = Date.now();

        const dragOffsetValue = isVerticalSwipe ? dragOffset.y : dragOffset.x;
        // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
        if (
            lastTimeDragPreventedRef.current
            && currentTime - lastTimeDragPreventedRef.current < scrollLockTimeout
            && dragOffsetValue === 0
        ) {
            lastTimeDragPreventedRef.current = currentTime;
            return;
        }

        // Keep climbing up the DOM tree as long as there's a parent
        while (target) {
            // Check if the element is scrollable
            if (target.scrollHeight > target.clientHeight) {
                if (target.scrollTop !== 0) {
                    lastTimeDragPreventedRef.current = Date.now();

                    // The element is scrollable and not scrolled to the top, so don't drag
                    return;
                }

                if (target.getAttribute('role') === 'dialog') {
                    break;
                }
            }

            // Move up to the parent element
            target = target.parentNode as HTMLElement;
        }

        const panelRect = panel?.getBoundingClientRect() ?? { x: 0, y: 0 };

        cancelledSwipeRef.current = false;
        intendedSwipeDirectionRef.current = undefined;
        maxSwipeDisplacementRef.current = 0;
        dragStartPosRef.current = { x: event.clientX, y: event.clientY };
        panelStartPosRef.current = { x: panelRect.x, y: panelRect.y };
        swipeCancelBaselineRef.current = dragStartPosRef.current;

        if (draggableRef.current && panel) {
            setDragOffset({
                x: 0,
                y: 0
            });
        }

        setIsSwiping(true);
        setIsRealSwipe(false);
        isFirstPointerMoveRef.current = true;
        startTimeRef.current = Date.now();

        draggableRef.current?.setPointerCapture(event.pointerId);

        onDragStart?.(event);
    }

    function handlePointerMove(event: React.PointerEvent) {
        if (!isSwiping) {
            return;
        }

        // Prevent text selection on Safari
        event.preventDefault();

        if (isFirstPointerMoveRef.current) {
            // Adjust the starting position to the current position on the first move
            // to account for the delay between pointerdown and the first pointermove on iOS.
            dragStartPosRef.current = { x: event.clientX, y: event.clientY };
            isFirstPointerMoveRef.current = false;
        }

        const {
            clientY,
            clientX,
            movementX,
            movementY
        } = event;

        if (
            (movementY < 0 && clientY > swipeCancelBaselineRef.current.y)
            || (movementY > 0 && clientY < swipeCancelBaselineRef.current.y)
        ) {
            swipeCancelBaselineRef.current = { x: swipeCancelBaselineRef.current.x, y: clientY };
        }

        if (
            (movementX < 0 && clientX > swipeCancelBaselineRef.current.x)
            || (movementX > 0 && clientX < swipeCancelBaselineRef.current.x)
        ) {
            swipeCancelBaselineRef.current = { x: clientX, y: swipeCancelBaselineRef.current.y };
        }

        const deltaX = clientX - dragStartPosRef.current.x;
        const deltaY = clientY - dragStartPosRef.current.y;
        const cancelDeltaY = clientY - swipeCancelBaselineRef.current.y;
        const cancelDeltaX = clientX - swipeCancelBaselineRef.current.x;

        if (!isRealSwipe) {
            const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (movementDistance >= MIN_DRAG_THRESHOLD) {
                setIsRealSwipe(true);
            }
        }

        let candidate: useDrawerGesture.SwipeDirection | undefined;
        if (!intendedSwipeDirectionRef.current) {
            if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                candidate = deltaX > 0 ? 'right' : 'left';
            }
            else {
                candidate = deltaY > 0 ? 'down' : 'up';
            }

            if (candidate && candidate === swipeDirection) {
                intendedSwipeDirectionRef.current = candidate;
                maxSwipeDisplacementRef.current = getDisplacement(candidate, deltaX, deltaY);
            }
        }
        else {
            const direction = intendedSwipeDirectionRef.current;
            const currentDisplacement = getDisplacement(direction, cancelDeltaX, cancelDeltaY);
            if (currentDisplacement > SWIPE_THRESHOLD) {
                cancelledSwipeRef.current = false;
            }
            else if (
                maxSwipeDisplacementRef.current - currentDisplacement
                >= REVERSE_CANCEL_THRESHOLD
            ) {
                // Mark that a change-of-mind has occurred
                cancelledSwipeRef.current = true;
            }
        }

        let shouldDamp = false;
        const isCloseDirectionValue = isCloseDirection(isVerticalSwipe
            ? { direction: swipeDirection, deltaAxis: deltaY }
            : { direction: swipeDirection, deltaAxis: deltaX });

        function calculateDampedParts() {
            if (!snapPoints || snapPoints.length === 0 || activeSnapPointIndex === snapPoints.length - 1) {
                shouldDamp = true;
                return;
            }

            if (activeSnapPointIndex === snapPoints.length - 1 && !isCloseDirectionValue) {
                shouldDamp = true;
            }
        }

        calculateDampedParts();

        let finalDeltaX = deltaX;
        let finalDeltaY = deltaY;

        if (shouldDamp) {
            finalDeltaX = isVerticalSwipe ? deltaX : applyDamping(deltaX);
            finalDeltaY = isVerticalSwipe ? applyDamping(deltaY) : deltaY;
        }
        else if (snapPoints && snapPoints.length > 0 && swipeDirection && !isCloseDirectionValue) {
            const panelStartPosition = isVerticalSwipe ? panelStartPosRef.current.y : panelStartPosRef.current.x;
            const currentDelta = isVerticalSwipe ? deltaY : deltaX;

            const potentialPosition = panelStartPosition + currentDelta;

            let overshoot = 0;
            let baseDelta = 0;
            let isOvershooting = false;

            if (currentDelta < 0 && potentialPosition < containerSize.height - maxSnapPoint) {
                overshoot = potentialPosition - maxSnapPoint;
                baseDelta = Math.sign(currentDelta) * (panelStartPosition - (containerSize.height - maxSnapPoint));
                isOvershooting = true;
            }
            else if (currentDelta > 0 && (potentialPosition + maxSnapPoint) > maxSnapPoint) {
                overshoot = potentialPosition;
                baseDelta = Math.sign(currentDelta) * Math.abs(maxSnapPoint - (panelStartPosition + maxSnapPoint));
                isOvershooting = true;
            }

            if (isOvershooting) {
                const dampedOvershoot = applyDamping(overshoot);

                const finalDelta = baseDelta + dampedOvershoot;

                if (isVerticalSwipe) {
                    finalDeltaY = finalDelta;
                }
                else {
                    finalDeltaX = finalDelta;
                }
            }
        }

        const newOffsetX = isVerticalSwipe ? 0 : finalDeltaX;
        const newOffsetY = isVerticalSwipe ? finalDeltaY : 0;

        setDragOffset({ x: newOffsetX, y: newOffsetY });
        onDragMove?.(event, { x: newOffsetX, y: newOffsetY });
    }

    function handlePointerUp(event: React.PointerEvent) {
        if (!isSwiping || !enabled) {
            return;
        }

        draggableRef.current?.releasePointerCapture(event.pointerId);

        setIsSwiping(false);
        setIsRealSwipe(false);

        const releaseTime = Date.now();
        const timeDelta = releaseTime - (startTimeRef.current ?? 0);
        startTimeRef.current = null;

        if (cancelledSwipeRef.current) {
            return;
        }

        const isFirst = activeSnapPointIndex === 0;

        const deltaX = dragOffset.x;
        const deltaY = dragOffset.y;

        const velocityX = Math.abs(deltaX) / timeDelta;
        const velocityY = Math.abs(deltaY) / timeDelta;

        const positionDelta = isVerticalSwipe ? deltaY : deltaX;
        const velocity = isVerticalSwipe ? velocityY : velocityX;

        const panelSize = panel?.getBoundingClientRect() ?? { width: containerSize.width, height: containerSize.height };

        const panelSizeValue = isVerticalSwipe ? panelSize.height : panelSize.width;

        // Calculate percentage
        const positionDeltaAbsolute = Math.abs(positionDelta);

        const signSwipeDirection = positionDelta >= 0 ? 1 : -1; // 1 = up, -1 = down
        const isCloseDirectionValue = isCloseDirection({ direction: swipeDirection, deltaAxis: signSwipeDirection });

        function calculateShouldClose() {
        // Handle snap points
            if (snapPoints && snapPoints.length > 0) {
                // Find closest snap point
                const closestSnapPoint = findClosestSnapPoint(
                    positionDelta + (snapPointsOffset[activeSnapPointIndex ?? 0] ?? 0),
                    snapPointsOffset
                );

                if (velocity > VELOCITY_FOR_FORCED_CLOSE && Math.abs(positionDelta) < panelSizeValue * FORCED_CLOSE_THRESHOLD) {
                    if (isCloseDirectionValue) {
                        return true;
                    }

                    snapToPoint(snapPointsOffset[snapPoints.length - 1] ?? 0);
                    return false;
                }

                if (isFirst && isCloseDirectionValue && (positionDeltaAbsolute > closeThreshold || velocity > velocityThreshold)) {
                    return true;
                }

                snapToPoint(closestSnapPoint);
                return false;
            }
            else {
                switch (swipeDirection) {
                    case 'right':
                    case 'down':
                        if (positionDeltaAbsolute > closeThreshold || velocity > velocityThreshold) {
                            return true;
                        }
                        break;
                    case 'left':
                    case 'up':
                        if (positionDeltaAbsolute < -closeThreshold || velocity > velocityThreshold) {
                            return true;
                        }
                        break;
                    default:
                        break;
                }

                return false;
            }
        }

        const shouldClose = calculateShouldClose();

        if (shouldClose) {
            onDragEnd?.(event, {
                shouldClose: true,
                dismissDirection: swipeDirection,
                velocityX,
                velocityY
            });
        }
        else {
            onDragEnd?.(event, {
                shouldClose: false,
                dismissDirection: undefined,
                velocityX,
                velocityY
            });
        }
    }

    useIsoLayoutEffect(() => {
        const element = draggableRef.current;
        if (!element) {
            return undefined;
        }

        function preventDefaultTouchStart(event: TouchEvent) {
            if (contains(element, event.target as HTMLElement | null)) {
                event.preventDefault();
            }
        }

        element.addEventListener('touchmove', preventDefaultTouchStart, { passive: false });
        return () => {
            element.removeEventListener('touchmove', preventDefaultTouchStart);
        };
    }, []);

    useIsoLayoutEffect(() => {
        if (activeSnapPointIndex === 0) {
            const newIndex
                = snapPointsOffset?.findIndex((snapPoint) => snapPoint === snapPointsOffset[activeSnapPointIndex]) ?? -1;

            if (snapPointsOffset && newIndex !== -1 && typeof snapPointsOffset[newIndex] === 'number') {
                snapToPoint(snapPointsOffset[newIndex] as number);
            }
        }
    }, [activeSnapPointIndex, snapPoints, snapPointsOffset, snapToPoint]);

    function getDragStyles() {
        const hasSnapPoints = snapPoints && snapPoints.length > 0;

        const swipeMovement = isVertical(swipeDirection) ? dragOffset.y : dragOffset.x;

        const transform = snapPointsOffset[activeSnapPointIndex ?? 0];

        return {
            ...(isSwiping
                ? { transition: 'none', [DrawerGestureCssVars.swipeMovement]: `${swipeMovement}px` }
                : {}),

            ...(hasSnapPoints
                ? {
                    [DrawerGestureCssVars.snapPointIndex]: `${activeSnapPointIndex ?? 0}`,
                    [DrawerGestureCssVars.snapPointTransform]: `${transform}px`,
                    [DrawerGestureCssVars.snapPointMax]: `${maxSnapPoint}px`
                }
                : {})
        };
    }

    const dataAttributes = React.useMemo(() =>
        getDrawerDataAttributes(snapPoints && snapPoints.length > 0, swipeDirection), [snapPoints, swipeDirection]);

    return {
        gestureProps: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            style: getDragStyles(),
            dataAttributes
        },
        gestureOffset: swipeDirection === 'left' || swipeDirection === 'right' ? dragOffset.x : dragOffset.y,
        isGesturing: isSwiping
    };
}

export namespace useDrawerGesture {
    export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

    export type SnapPoint = number | string;

    export type Params = {
        /**
         * Direction in which the element can be swiped.
         */
        swipeDirection: SwipeDirection;
        /**
         * Whether dragging is enabled.
         * @default true
         */
        enabled?: boolean;
        /**
         * Callback when drag starts.
         */
        onDragStart?: (event: React.PointerEvent) => void;
        /**
         * Callback when drag moves.
         */
        onDragMove?: (event: React.PointerEvent, offset: { x: number; y: number }) => void;
        /**
         * Callback when drag ends.
         */
        onDragEnd?: (event: React.PointerEvent, options: {
            shouldClose: boolean;
            dismissDirection: SwipeDirection | undefined;
            velocityX: number;
            velocityY: number;
        }) => void;
        /**
         * Array of snap points. Can be numbers (pixels) or strings (percentages like "50%").
         * null means fully closed.
         */
        snapPoints?: SnapPoint[];
        /**
         * Current active snap point index.
         */
        activeSnapPointIndex?: number;
        onActiveSnapPointIndexChange?: (index: number) => void;
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
        /**
         * Reference to the draggable element.
         */
        draggableRef: React.RefObject<HTMLElement | null>;
        /**
         * Reference to the panel element.
         */
        panelRef: React.RefObject<HTMLElement | null> | HTMLElement | null;

        /**
         * Timeout for scroll lock.
         * @default 100
         */
        scrollLockTimeout?: number;

        /**
         * Factor for damping.
         * @default 0.5
         */
        dampingFactor?: number;
    };

    export type ReturnType = {
        gestureProps: {
            onPointerDown: (event: React.PointerEvent) => void;
            onPointerMove: (event: React.PointerEvent) => void;
            onPointerUp: (event: React.PointerEvent) => void;
            style: React.CSSProperties;
            dataAttributes: {
                [DrawerGestureDataAttributes.snapPoints]: string | null;
                [DrawerGestureDataAttributes.swipeDirectionRight]: string | null;
                [DrawerGestureDataAttributes.swipeDirectionLeft]: string | null;
                [DrawerGestureDataAttributes.swipeDirectionUp]: string | null;
                [DrawerGestureDataAttributes.swipeDirectionDown]: string | null;
            };
        };
        gestureOffset: number;
        isGesturing: boolean;
    };
}
