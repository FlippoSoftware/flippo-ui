import React from 'react';

import { isTarget } from '~@lib/isTarget';

import type { HookTarget } from '~@lib/isTarget';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useRefAsState } from '../useRefAsState';

import type { RefAsState } from '../useRefAsState';

export type UseMouseOptions = {
    /** Reset position to (0, 0) when mouse leaves the element */
    resetOnExit?: boolean;
};

export type UseMouseReturn = {
    x: number;
    y: number;
};

export function useMouse(target: HookTarget, options?: UseMouseOptions): UseMouseReturn;

export function useMouse<Target extends HTMLElement>(
    options?: UseMouseOptions
): UseMouseReturn & { ref: RefAsState<Target> };

export function useMouse<Target extends HTMLElement>(
    ...args: [HookTarget, UseMouseOptions?] | [UseMouseOptions?]
): UseMouseReturn | (UseMouseReturn & { ref: RefAsState<Target> }) {
    const target = (isTarget(args[0] as HookTarget) ? args[0] : undefined) as HookTarget | undefined;
    const options = ((target ? args[1] : args[0]) ?? { resetOnExit: false }) as UseMouseOptions;

    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const internalRef = useRefAsState<Target>();

    const resetMousePosition = () => setPosition({ x: 0, y: 0 });

    const element = target ? isTarget.getElement(target) : internalRef.current;

    useIsoLayoutEffect(() => {
        const targetElement = element ?? document;

        const setMousePosition = (event: MouseEvent) => {
            if (element) {
                const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

                const x = Math.max(
                    0,
                    Math.round(event.pageX - rect.left - (window.scrollX || window.scrollX))
                );

                const y = Math.max(
                    0,
                    Math.round(event.pageY - rect.top - (window.scrollY || window.scrollY))
                );

                setPosition({ x, y });
            }
            else {
                setPosition({ x: event.clientX, y: event.clientY });
            }
        };

        targetElement.addEventListener('mousemove', setMousePosition as any);
        if (options.resetOnExit) {
            targetElement.addEventListener('mouseleave', resetMousePosition as any);
        }

        return () => {
            targetElement.removeEventListener('mousemove', setMousePosition as any);
            if (options.resetOnExit) {
                targetElement.removeEventListener('mouseleave', resetMousePosition as any);
            }
        };
    }, [element, options.resetOnExit]);

    if (target) {
        return position;
    }

    return { ref: internalRef, ...position };
}
