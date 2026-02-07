import { isTarget } from '~@lib/isTarget';

import type { HookTarget } from '~@lib/isTarget';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useRefAsState } from '../useRefAsState';
import { useStableCallback } from '../useStableCallback';
import { useValueAsRef } from '../useValueAsRef';

import type { RefAsState } from '../useRefAsState';

type EventType = MouseEvent | TouchEvent;

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

export type UseClickOutsideOptions = {
    /** DOM events that trigger the callback */
    events?: string[] | null;
    /** Additional nodes to exclude from click outside detection */
    nodes?: (HookTarget | HTMLElement | null)[];
};

function resolveNode(node: HookTarget | HTMLElement | null): HTMLElement | null {
    if (!node)
        return null;
    if (node instanceof HTMLElement)
        return node;
    if (isTarget(node))
        return isTarget.getElement(node) as HTMLElement | null;
    return null;
}

export function useClickOutside(
    target: HookTarget,
    callback: (event: EventType) => void,
    options?: UseClickOutsideOptions
): void;

export function useClickOutside<Target extends HTMLElement>(
    callback: (event: EventType) => void,
    options?: UseClickOutsideOptions
): { ref: RefAsState<Target> };

export function useClickOutside<Target extends HTMLElement>(
    ...args:
      | [HookTarget, (event: EventType) => void, UseClickOutsideOptions?]
      | [(event: EventType) => void, UseClickOutsideOptions?]
): void | { ref: RefAsState<Target> } {
    const target = (isTarget(args[0] as HookTarget) ? args[0] : undefined) as HookTarget | undefined;
    const callback = (target ? args[1] : args[0]) as (event: EventType) => void;
    const options = (target ? args[2] : args[1]) as UseClickOutsideOptions | undefined;

    const events = options?.events;
    const nodes = options?.nodes;

    const internalRef = useRefAsState<Target>();
    const nodesRef = useValueAsRef(nodes);

    const eventsList = events || DEFAULT_EVENTS;

    const stableCallback = useStableCallback(callback);

    const element = target ? isTarget.getElement(target) : internalRef.current;

    useIsoLayoutEffect(() => {
        const listener = (event: Event) => {
            const { target: eventTarget } = event ?? {};
            const currentNodes = nodesRef.current;

            if (Array.isArray(currentNodes) && currentNodes.length > 0) {
                const resolvedNodes = currentNodes.map(resolveNode).filter(Boolean) as HTMLElement[];
                const shouldIgnore
                    = !document.body.contains(eventTarget as Node) && (eventTarget as Element)?.tagName !== 'HTML';
                const shouldTrigger = resolvedNodes.every((node) => !!node && !event.composedPath().includes(node));
                shouldTrigger && !shouldIgnore && stableCallback(event as EventType);
            }
            else if (element && element instanceof Element && !element.contains(eventTarget as Node)) {
                stableCallback(event as EventType);
            }
        };

        eventsList.forEach((fn) => document.addEventListener(fn, listener));

        return () => {
            eventsList.forEach((fn) => document.removeEventListener(fn, listener));
        };
    }, [element, eventsList]);

    if (target) {
        return undefined;
    }

    return { ref: internalRef };
}
