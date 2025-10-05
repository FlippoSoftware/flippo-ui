import React from 'react';

import type { Interaction, TransitionStatus } from '@flippo-ui/hooks/';
import type { HTMLProps } from '~@lib/types';
import type { FloatingRootContext } from '~@packages/floating-ui-react';

import type { PopoverRoot } from './PopoverRoot';

export type PopoverRootContextValue = {
    open: boolean;
    openOnHover: boolean;
    setOpen: (open: boolean, eventDetails: PopoverRoot.ChangeEventDetails) => void;
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
    openMethod: Interaction | null;
    openReason: PopoverRoot.ChangeEventReason | null;
    onOpenChangeComplete: ((open: boolean) => void) | undefined;
    modal: boolean | 'trap-focus';
};

export const PopoverRootContext = React.createContext<PopoverRootContextValue | undefined>(undefined);

export function usePopoverRootContext(optional?: false): PopoverRootContextValue;
export function usePopoverRootContext(optional: true): PopoverRootContextValue | undefined;
export function usePopoverRootContext(optional?: boolean) {
    const context = React.use(PopoverRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: PopoverRootContext is missing. Popover parts must be placed within <Popover.Root>.'
        );
    }
    return context;
}
