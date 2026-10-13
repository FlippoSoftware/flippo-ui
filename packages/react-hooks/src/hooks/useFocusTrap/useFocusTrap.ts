import React from 'react';

import { tabbable } from 'tabbable';

import { isTarget } from '~@lib/isTarget';

import type { HookTarget } from '~@lib/isTarget';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

function focusElement(element: HTMLElement) {
    const autofocusElement = element.querySelector('[data-autofocus]') as HTMLElement;
    if (autofocusElement)
        return autofocusElement.focus();
    const focusableElements = tabbable(element);
    if (focusableElements.length)
        focusableElements[0]?.focus();
}

export type UseFocusTrapReturn = {
    active: boolean;
    disable: () => void;
    enable: () => void;
    toggle: () => void;
};

export function useFocusTrap(target: HookTarget, active?: boolean): UseFocusTrapReturn;
export function useFocusTrap<Target extends HTMLElement>(active?: boolean): UseFocusTrapReturn & { ref: React.RefObject<Target> };
export function useFocusTrap<Target extends HTMLElement>(...args: any[]) {
    const target = (isTarget(args[0]) ? args[0] : undefined) as HookTarget;
    const initialActive = target ? args[1] : args[0];

    const [active, setActive] = React.useState(initialActive);
    const internalRef = React.useRef<Target>(null);

    const enable = () => setActive(true);
    const disable = () => setActive(false);
    const toggle = () => setActive((prevActive: boolean) => !prevActive);

    useIsoLayoutEffect(() => {
        if (!active)
            return;

        const element = target ? isTarget.getElement(target) : internalRef.current;
        if (!element)
            return;

        const htmlElement = element as HTMLElement;
        focusElement(htmlElement);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab')
                return;

            const [firstElement, ...restElements] = tabbable(htmlElement);
            if (!restElements.length)
                return;

            const lastElement = restElements.at(-1)!;

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }

            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement?.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [active, target && isTarget.getRawElement(target), internalRef.current]);

    if (target) {
        return {
            active,
            enable,
            disable,
            toggle
        };
    }
    return {
        active,
        enable,
        disable,
        toggle,
        ref: internalRef
    };
}
