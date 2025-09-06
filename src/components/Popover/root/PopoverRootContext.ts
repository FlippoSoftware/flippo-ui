'use client';

import React from 'react';

import type { TInteraction, TransitionStatus } from '@flippo-ui/hooks';

import type { TBaseOpenChangeReason } from '@lib/translateOpenChangeReason';
import type { HTMLProps } from '@lib/types';
import type { FloatingRootContext } from '@packages/floating-ui-react';

export type PopoverOpenChangeReason = TBaseOpenChangeReason | 'close-press';

export type TPopoverRootContext = {
    open: boolean;
    openOnHover: boolean;
    setOpen: (
        open: boolean,
        event: Event | undefined,
        reason: PopoverOpenChangeReason | undefined,
    ) => void;
    triggerElement: Element | null;
    setTriggerElement: (el: Element | null) => void;
    positionerElement: HTMLElement | null;
    setPositionerElement: (el: HTMLElement | null) => void;
    popupRef: React.RefObject<HTMLElement | null>;
    backdropRef: React.RefObject<HTMLDivElement | null>;
    internalBackdropRef: React.RefObject<HTMLDivElement | null>;
    delay: number;
    closeDelay: number;
    instantType: 'dismiss' | 'click' | undefined;
    mounted: boolean;
    setMounted: React.Dispatch<React.SetStateAction<boolean>>;
    transitionStatus: TransitionStatus;
    titleId: string | undefined;
    setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>;
    descriptionId: string | undefined;
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    floatingRootContext: FloatingRootContext;
    triggerProps: HTMLProps;
    popupProps: HTMLProps;
    openMethod: TInteraction | null;
    openReason: PopoverOpenChangeReason | null;
    onOpenChangeComplete: ((open: boolean) => void) | undefined;
    modal: boolean | 'trap-focus';
};

export const PopoverRootContext = React.createContext<TPopoverRootContext | undefined>(undefined);

export function usePopoverRootContext(optional?: false): TPopoverRootContext;
export function usePopoverRootContext(optional: true): TPopoverRootContext | undefined;
export function usePopoverRootContext(optional?: boolean) {
    const context = React.use(PopoverRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: PopoverRootContext is missing. Popover parts must be placed within <Popover.Root>.'
        );
    }
    return context;
}
