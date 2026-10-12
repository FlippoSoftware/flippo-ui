import React from 'react';

import { isTarget } from '~@lib/isTarget';

import type { HookTarget } from '~@lib/isTarget';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useRefAsState } from '../useRefAsState';
import { useStableCallback } from '../useStableCallback';
import { useValueAsRef } from '../useValueAsRef';

import type { RefAsState } from '../useRefAsState';

export function useMutationObserver(
    target: HookTarget,
    callback: MutationCallback,
    options: MutationObserverInit
): void;

export function useMutationObserver<Target extends HTMLElement>(
    callback: MutationCallback,
    options: MutationObserverInit
): { ref: RefAsState<Target> };

export function useMutationObserver<Target extends HTMLElement>(
    ...args: [HookTarget, MutationCallback, MutationObserverInit] | [MutationCallback, MutationObserverInit]
): void | { ref: RefAsState<Target> } {
    const target = (isTarget(args[0] as HookTarget) ? args[0] : undefined) as HookTarget | undefined;
    const callback = (target ? args[1] : args[0]) as MutationCallback;
    const options = (target ? args[2] : args[1]) as MutationObserverInit;

    const observer = React.useRef<MutationObserver>(null);
    const internalRef = useRefAsState<Target>();
    const optionsRef = useValueAsRef(options);

    const stableCallback = useStableCallback(callback);

    const element = target ? isTarget.getElement(target) : internalRef.current;

    useIsoLayoutEffect(() => {
        if (element) {
            observer.current = new MutationObserver(stableCallback);
            observer.current.observe(element as Node, optionsRef.current);
        }

        return () => {
            observer.current?.disconnect();
        };
    }, [element]);

    if (target) {
        return undefined;
    }

    return { ref: internalRef };
}
