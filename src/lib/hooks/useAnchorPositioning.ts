'use client';
import type {
    AutoUpdateOptions,
    FloatingContext,
    FloatingRootContext,
    Middleware,
    MiddlewareState,
    Padding,
    Side as PhysicalSide,
    Placement,
    UseFloatingOptions,
    VirtualElement
} from '@floating-ui/react';
import type { Rect } from '@floating-ui/utils';
import { useEnhancedEffect, useEventCallback, useLatestRef } from '@flippo_ui/hooks';
import {
    arrow,
    autoUpdate,
    flip,
    hide,
    limitShift,
    offset,
    shift,
    size,
    useFloating
} from '@floating-ui/react';
import {
    getAlignment,
    getSide,
    getSideAxis
} from '@floating-ui/utils';
import React from 'react';
import { ownerDocument } from '../owner';
import { useDirection } from './useDirection';

function getLogicalSide(sideParam: TSide, renderedSide: PhysicalSide, isRtl: boolean): TSide {
    const isLogicalSideParam = sideParam === 'inline-start' || sideParam === 'inline-end';
    const logicalRight = isRtl ? 'inline-start' : 'inline-end';
    const logicalLeft = isRtl ? 'inline-end' : 'inline-start';

    return (
        {
            top: 'top',
            right: isLogicalSideParam ? logicalRight : 'right',
            bottom: 'bottom',
            left: isLogicalSideParam ? logicalLeft : 'left'
        } satisfies Record<PhysicalSide, TSide>
    )[renderedSide];
}

function getOffsetData(state: MiddlewareState, sideParam: TSide, isRtl: boolean) {
    const { rects, placement } = state;
    const data = {
        side: getLogicalSide(sideParam, getSide(placement), isRtl),
        align: getAlignment(placement) || 'center',
        anchor: { width: rects.reference.width, height: rects.reference.height },
        positioner: { width: rects.floating.width, height: rects.floating.height }
    } as const;

    return data;
}

export type TSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start';
export type TAlign = 'start' | 'center' | 'end';
export type TBoundary = 'clipping-ancestors' | Element | Element[] | Rect;
export type OffsetFunction = (data: {
    side: TSide;
    align: TAlign;
    anchor: { width: number; height: number };
    positioner: { width: number; height: number };
}) => number;

type SideFlipMode = {
    side?: 'flip' | 'none';
    align?: 'flip' | 'shift' | 'none';
    fallbackAxisSide?: 'start' | 'end' | 'none';
};

type SideShiftMode = {
    side?: 'shift' | 'none';
    align?: 'shift' | 'none';
    fallbackAxisSide?: 'start' | 'end' | 'none';
};

export type CollisionAvoidance = SideFlipMode | SideShiftMode;

export function useAnchorPositioning(
    params: NUseAnchorPositioning.Parameters
): NUseAnchorPositioning.ReturnValue {
    const {
        // Public parameters
        anchor,
        positionMethod = 'absolute',
        side: sideParam = 'bottom',
        sideOffset = 0,
        align = 'center',
        alignOffset = 0,
        collisionBoundary,
        collisionPadding = 5,
        sticky = false,
        arrowPadding = 5,
        trackAnchor = true,
        // Private parameters
        keepMounted = false,
        floatingRootContext,
        mounted,
        collisionAvoidance,
        shiftCrossAxis = false,
        nodeId,
        adaptiveOrigin
    } = params;

    const collisionAvoidanceSide = collisionAvoidance.side || 'flip';
    const collisionAvoidanceAlign = collisionAvoidance.align || 'flip';
    const collisionAvoidanceFallbackAxisSide = collisionAvoidance.fallbackAxisSide || 'end';

    const anchorFn = typeof anchor === 'function' ? anchor : undefined;
    const anchorFnCallback = useEventCallback(anchorFn);
    const anchorDep = anchorFn ? anchorFnCallback : anchor;
    const anchorValueRef = useLatestRef(anchor);

    const direction = useDirection();
    const isRtl = direction === 'rtl';

    const side = (
        {
            'top': 'top',
            'right': 'right',
            'bottom': 'bottom',
            'left': 'left',
            'inline-end': isRtl ? 'left' : 'right',
            'inline-start': isRtl ? 'right' : 'left'
        } satisfies Record<TSide, PhysicalSide>
    )[sideParam];

    const placement = align === 'center' ? side : (`${side}-${align}` as Placement);

    const commonCollisionProps = {
        boundary: collisionBoundary === 'clipping-ancestors' ? 'clippingAncestors' : collisionBoundary,
        padding: collisionPadding
    } as const;

    const arrowRef = React.useRef<Element | null>(null);

    const sideOffsetRef = useLatestRef(sideOffset);
    const alignOffsetRef = useLatestRef(alignOffset);
    const sideOffsetDep = typeof sideOffset !== 'function' ? sideOffset : 0;
    const alignOffsetDep = typeof alignOffset !== 'function' ? alignOffset : 0;

    const middleware: UseFloatingOptions['middleware'] = [offset(
        (state) => {
            const data = getOffsetData(state, sideParam, isRtl);

            const sideAxis
                    = typeof sideOffsetRef.current === 'function'
                        ? sideOffsetRef.current(data)
                        : sideOffsetRef.current;
            const alignAxis
                    = typeof alignOffsetRef.current === 'function'
                        ? alignOffsetRef.current(data)
                        : alignOffsetRef.current;

            return {
                mainAxis: sideAxis,
                crossAxis: alignAxis,
                alignmentAxis: alignAxis
            };
        },
        [
            sideOffsetDep,
            alignOffsetDep,
            isRtl,
            sideParam
        ]
    )];

    const shiftDisabled = collisionAvoidanceAlign === 'none' && collisionAvoidanceSide !== 'shift';
    const crossAxisShiftEnabled
        = !shiftDisabled && (sticky || shiftCrossAxis || collisionAvoidanceSide === 'shift');

    const flipMiddleware
        = collisionAvoidanceSide === 'none'
            ? null
            : flip({
                ...commonCollisionProps,
                mainAxis: !shiftCrossAxis && collisionAvoidanceSide === 'flip',
                crossAxis: collisionAvoidanceAlign === 'flip',
                fallbackAxisSideDirection: collisionAvoidanceFallbackAxisSide
            });
    const shiftMiddleware = shiftDisabled
        ? null
        : shift(
            (data) => {
                const html = ownerDocument(data.elements.floating).documentElement;
                return {
                    ...commonCollisionProps,
                    rootBoundary: shiftCrossAxis
                        ? {
                            x: 0,
                            y: 0,
                            width: html.clientWidth,
                            height: html.clientHeight
                        }
                        : undefined,
                    mainAxis: collisionAvoidanceAlign !== 'none',
                    crossAxis: crossAxisShiftEnabled,
                    limiter:
                        sticky || shiftCrossAxis
                            ? undefined
                            : limitShift(() => {
                                if (!arrowRef.current) {
                                    return {};
                                }
                                const { height } = arrowRef.current.getBoundingClientRect();
                                return {
                                    offset:
                                        height / 2 + (typeof collisionPadding === 'number' ? collisionPadding : 0)
                                };
                            })
                };
            },
            [
                commonCollisionProps,
                sticky,
                shiftCrossAxis,
                collisionPadding,
                collisionAvoidanceAlign
            ]
        );

    // https://floating-ui.com/docs/flip#combining-with-shift
    if (
        collisionAvoidanceSide === 'shift'
        || collisionAvoidanceAlign === 'shift'
        || align === 'center'
    ) {
        middleware.push(shiftMiddleware, flipMiddleware);
    }
    else {
        middleware.push(flipMiddleware, shiftMiddleware);
    }

    middleware.push(
        size({
            ...commonCollisionProps,
            apply({
                elements: { floating },
                rects: { reference },
                availableWidth,
                availableHeight
            }) {
                Object.entries({
                    '--available-width': `${availableWidth}px`,
                    '--available-height': `${availableHeight}px`,
                    '--anchor-width': `${reference.width}px`,
                    '--anchor-height': `${reference.height}px`
                }).forEach(([key, value]) => {
                    floating.style.setProperty(key, value);
                });
            }
        }),
        arrow(
            () => ({
                element: arrowRef.current || document.createElement('div'),
                padding: arrowPadding
            }),
            [arrowPadding]
        ),
        hide(),
        {
            name: 'transformOrigin',
            fn(state) {
                const {
                    elements,
                    middlewareData,
                    placement: renderedPlacement,
                    rects,
                    y
                } = state;

                const currentRenderedSide = getSide(renderedPlacement);
                const currentRenderedAxis = getSideAxis(currentRenderedSide);
                const arrowEl = arrowRef.current;
                const arrowX = middlewareData.arrow?.x || 0;
                const arrowY = middlewareData.arrow?.y || 0;
                const arrowWidth = arrowEl?.clientWidth || 0;
                const arrowHeight = arrowEl?.clientHeight || 0;
                const transformX = arrowX + arrowWidth / 2;
                const transformY = arrowY + arrowHeight / 2;
                const shiftY = Math.abs(middlewareData.shift?.y || 0);
                const halfAnchorHeight = rects.reference.height / 2;
                const isOverlappingAnchor
                    = shiftY
                      > (typeof sideOffset === 'function'
                          ? sideOffset(getOffsetData(state, sideParam, isRtl))
                          : sideOffset);

                const adjacentTransformOrigin = {
                    top: `${transformX}px calc(100% + ${sideOffset}px)`,
                    bottom: `${transformX}px ${-sideOffset}px`,
                    left: `calc(100% + ${sideOffset}px) ${transformY}px`,
                    right: `${-sideOffset}px ${transformY}px`
                }[currentRenderedSide];
                const overlapTransformOrigin = `${transformX}px ${rects.reference.y + halfAnchorHeight - y}px`;

                elements.floating.style.setProperty(
                    '--transform-origin',
                    crossAxisShiftEnabled && currentRenderedAxis === 'y' && isOverlappingAnchor
                        ? overlapTransformOrigin
                        : adjacentTransformOrigin
                );

                return {};
            }
        },
        adaptiveOrigin
    );

    // Ensure positioning doesn't run initially for `keepMounted` elements that
    // aren't initially open.
    let rootContext = floatingRootContext;
    if (!mounted && floatingRootContext) {
        rootContext = {
            ...floatingRootContext,
            elements: { reference: null, floating: null, domReference: null }
        };
    }

    const autoUpdateOptions: AutoUpdateOptions = React.useMemo(
        () => ({
            elementResize: trackAnchor && typeof ResizeObserver !== 'undefined',
            layoutShift: trackAnchor && typeof IntersectionObserver !== 'undefined'
        }),
        [trackAnchor]
    );

    const {
        refs,
        elements,
        x,
        y,
        middlewareData,
        update,
        placement: renderedPlacement,
        context,
        isPositioned,
        floatingStyles: originalFloatingStyles
    } = useFloating({
        rootContext,
        placement,
        middleware,
        strategy: positionMethod,
        whileElementsMounted: keepMounted
            ? undefined
            : (...args) => autoUpdate(...args, autoUpdateOptions),
        nodeId
    });

    const { sideX, sideY } = middlewareData.adaptiveOrigin || {};

    const floatingStyles = React.useMemo<React.CSSProperties>(
        () =>
            adaptiveOrigin
                ? { position: positionMethod, [sideX]: `${x}px`, [sideY]: `${y}px` }
                : originalFloatingStyles,
        [
            adaptiveOrigin,
            sideX,
            sideY,
            positionMethod,
            x,
            y,
            originalFloatingStyles
        ]
    );

    const registeredPositionReferenceRef = React.useRef<Element | VirtualElement | null>(null);

    useEnhancedEffect(() => {
        if (!mounted) {
            return;
        }

        const anchorValue = anchorValueRef.current;
        const resolvedAnchor = typeof anchorValue === 'function' ? anchorValue() : anchorValue;
        const unwrappedElement
            = (isRef(resolvedAnchor) ? resolvedAnchor.current : resolvedAnchor) || null;
        const finalAnchor = unwrappedElement || null;

        if (finalAnchor !== registeredPositionReferenceRef.current) {
            refs.setPositionReference(finalAnchor);
            registeredPositionReferenceRef.current = finalAnchor;
        }
    }, [
        mounted,
        refs,
        anchorDep,
        anchorValueRef
    ]);

    React.useEffect(() => {
        if (!mounted) {
            return;
        }

        const anchorValue = anchorValueRef.current;

        // Refs from parent components are set after useLayoutEffect runs and are available in useEffect.
        // Therefore, if the anchor is a ref, we need to update the position reference in useEffect.
        if (typeof anchorValue === 'function') {
            return;
        }

        if (isRef(anchorValue) && anchorValue.current !== registeredPositionReferenceRef.current) {
            refs.setPositionReference(anchorValue.current);
            registeredPositionReferenceRef.current = anchorValue.current;
        }
    }, [
        mounted,
        refs,
        anchorDep,
        anchorValueRef
    ]);

    React.useEffect(() => {
        if (keepMounted && mounted && elements.domReference && elements.floating) {
            return autoUpdate(elements.domReference, elements.floating, update, autoUpdateOptions);
        }
        return undefined;
    }, [
        keepMounted,
        mounted,
        elements,
        update,
        autoUpdateOptions
    ]);

    const renderedSide = getSide(renderedPlacement);
    const logicalRenderedSide = getLogicalSide(sideParam, renderedSide, isRtl);
    const renderedAlign = getAlignment(renderedPlacement) || 'center';
    const anchorHidden = Boolean(middlewareData.hide?.referenceHidden);

    const arrowStyles = React.useMemo(
        () => ({
            position: 'absolute' as const,
            top: middlewareData.arrow?.y,
            left: middlewareData.arrow?.x
        }),
        [middlewareData.arrow]
    );

    const arrowUncentered = middlewareData.arrow?.centerOffset !== 0;

    return React.useMemo(
        () => ({
            positionerStyles: floatingStyles,
            arrowStyles,
            arrowRef,
            arrowUncentered,
            side: logicalRenderedSide,
            align: renderedAlign,
            anchorHidden,
            refs,
            context,
            isPositioned,
            update
        }),
        [
            floatingStyles,
            arrowStyles,
            arrowRef,
            arrowUncentered,
            logicalRenderedSide,
            renderedAlign,
            anchorHidden,
            refs,
            context,
            isPositioned,
            update
        ]
    );
}

function isRef(
    param: Element | VirtualElement | React.RefObject<any> | null | undefined
): param is React.RefObject<any> {
    return param != null && 'current' in param;
}

export namespace NUseAnchorPositioning {
    export type SharedParameters = {
        anchor?:
          | Element
          | null
          | VirtualElement
          | React.RefObject<Element | null>
          | (() => Element | VirtualElement | null);
        positionMethod?: 'absolute' | 'fixed';
        side?: TSide;
        sideOffset?: number | OffsetFunction;
        align?: 'start' | 'end' | 'center';
        alignOffset?: number | OffsetFunction;
        collisionBoundary?: TBoundary;
        collisionPadding?: Padding;
        sticky?: boolean;
        arrowPadding?: number;
        trackAnchor?: boolean;
        collisionAvoidance?: CollisionAvoidance;
    };

    export type Parameters = {
        keepMounted?: boolean;
        trackCursorAxis?: 'none' | 'x' | 'y' | 'both';
        floatingRootContext?: FloatingRootContext;
        mounted: boolean;
        trackAnchor: boolean;
        nodeId?: string;
        adaptiveOrigin?: Middleware;
        collisionAvoidance: CollisionAvoidance;
        shiftCrossAxis?: boolean;
    } & SharedParameters;

    export type ReturnValue = {
        positionerStyles: React.CSSProperties;
        arrowStyles: React.CSSProperties;
        arrowRef: React.RefObject<Element | null>;
        arrowUncentered: boolean;
        side: TSide;
        align: TAlign;
        anchorHidden: boolean;
        refs: ReturnType<typeof useFloating>['refs'];
        context: FloatingContext;
        isPositioned: boolean;
        update: () => void;
    };
}
