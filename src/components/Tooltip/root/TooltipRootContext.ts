import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { HTMLProps } from '~@lib/types';
import type { FloatingRootContext } from '~@packages/floating-ui-react';

import type { TooltipRoot } from './TooltipRoot';

export type TooltipRootContextValue = {
    open: boolean;
    setOpen: (open: boolean, eventDetails: TooltipRoot.ChangeEventDetails) => void;
    setTriggerElement: (el: Element | null) => void;
    positionerElement: HTMLElement | null;
    setPositionerElement: (el: HTMLElement | null) => void;
    popupRef: React.RefObject<HTMLElement | null>;
    delay: number;
    closeDelay: number;
    mounted: boolean;
    setMounted: React.Dispatch<React.SetStateAction<boolean>>;
    triggerProps: HTMLProps;
    popupProps: HTMLProps;
    instantType: 'delay' | 'dismiss' | 'focus' | undefined;
    floatingRootContext: FloatingRootContext;
    trackCursorAxis: 'none' | 'x' | 'y' | 'both';
    transitionStatus: TransitionStatus;
    onOpenChangeComplete: ((open: boolean) => void) | undefined;
    hoverable: boolean;
};

export const TooltipRootContext = React.createContext<TooltipRootContextValue | undefined>(undefined);

export function useTooltipRootContext() {
    const context = React.use(TooltipRootContext);

    if (!context) {
        throw new Error('Flippo headless UI: TooltipRootContext is missing. Tooltip parts must be placed within <Tooltip.Root>.');
    }

    return context;
}
