import React from 'react';

import { isTarget } from '~@lib/isTarget';

import type { HookTarget } from '~@lib/isTarget';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useRefAsState } from '../useRefAsState';
import { useValueAsRef } from '../useValueAsRef';

import type { RefAsState } from '../useRefAsState';

export type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

const defaultState: ObserverRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
};
export type UseResizeObserverReturn<T extends HTMLElement = any> = readonly [RefAsState<T>, ObserverRect];

export function useResizeObserver(target: HookTarget, options?: ResizeObserverOptions): ObserverRect;

export function useResizeObserver<Target extends HTMLElement>(
    options?: ResizeObserverOptions
): UseResizeObserverReturn<Target>;

export function useResizeObserver<Target extends HTMLElement>(
    ...args: [HookTarget, ResizeObserverOptions?] | [ResizeObserverOptions?]
): ObserverRect | UseResizeObserverReturn<Target> {
    const target = (isTarget(args[0] as HookTarget) ? args[0] : undefined) as HookTarget | undefined;
    const options = (target ? args[1] : args[0]) as ResizeObserverOptions | undefined;

    const frameID = React.useRef(0);
    const internalRef = useRefAsState<Target>();
    const optionsRef = useValueAsRef(options);

    const [rect, setRect] = React.useState<ObserverRect>(defaultState);

    const element = target ? isTarget.getElement(target) : internalRef.current;

    const observer = React.useMemo(
        () =>
            typeof window !== 'undefined'
                ? new ResizeObserver((entries) => {
                    const entry = entries[0];

                    if (entry) {
                        cancelAnimationFrame(frameID.current);

                        frameID.current = requestAnimationFrame(() => {
                            const boxSize = entry.borderBoxSize?.[0] || entry.contentBoxSize?.[0];
                            if (boxSize) {
                                const width = boxSize.inlineSize;
                                const height = boxSize.blockSize;

                                setRect({
                                    width,
                                    height,
                                    x: entry.contentRect.x,
                                    y: entry.contentRect.y,
                                    top: entry.contentRect.top,
                                    left: entry.contentRect.left,
                                    bottom: entry.contentRect.bottom,
                                    right: entry.contentRect.right
                                });
                            }
                            else {
                                setRect(entry.contentRect);
                            }
                        });
                    }
                })
                : null,
        []
    );

    useIsoLayoutEffect(() => {
        if (element) {
            observer?.observe(element as Element, optionsRef.current);
        }

        return () => {
            observer?.disconnect();

            if (frameID.current) {
                cancelAnimationFrame(frameID.current);
            }
        };
    }, [element]);

    if (target) {
        return rect;
    }

    return [internalRef, rect] as const;
}

export function useElementSize<T extends HTMLElement = any>(options?: ResizeObserverOptions) {
    const [ref, { width, height }] = useResizeObserver<T>(options);
    return { ref, width, height };
}
