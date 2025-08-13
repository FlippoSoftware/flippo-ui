'use client';

import React from 'react';

import type { TransitionStatus } from '@flippo_ui/hooks';
import type { FloatingRootContext } from '@floating-ui/react';

import type { HTMLProps } from '@lib/types';

import type { TTooltipOpenChangeReason } from './useTooltipRoot';

export type TTooltipRootContext = {
    open: boolean;
    setOpen: (
        open: boolean,
        event: Event | undefined,
        reason: TTooltipOpenChangeReason | undefined,
    ) => void;
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

export const TooltipRootContext = React.createContext<TTooltipRootContext | undefined>(undefined);

export function useTooltipRootContext() {
    const context = React.use(TooltipRootContext);

    if (!context) {
        throw new Error('Flippo headless UI: TooltipRootContext is missing. Tooltip parts must be placed within <Tooltip.Root>.');
    }

    return context;
}
