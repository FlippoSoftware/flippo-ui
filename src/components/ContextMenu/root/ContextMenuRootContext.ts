import React from 'react';

import type { TBaseOpenChangeReason } from '@lib/translateOpenChangeReason';

export type TContextMenuRootContext = {
    anchor: { getBoundingClientRect: () => DOMRect };
    setAnchor: React.Dispatch<React.SetStateAction<TContextMenuRootContext['anchor']>>;
    backdropRef: React.RefObject<HTMLDivElement | null>;
    internalBackdropRef: React.RefObject<HTMLDivElement | null>;
    actionsRef: React.RefObject<{
        setOpen: (nextOpen: boolean, event?: Event, reason?: TBaseOpenChangeReason) => void;
    } | null>;
    positionerRef: React.RefObject<HTMLElement | null>;
    allowMouseUpTriggerRef: React.RefObject<boolean>;
    rootId: string | undefined;
};

export const ContextMenuRootContext = React.createContext<TContextMenuRootContext | undefined>(
    undefined
);

export function useContextMenuRootContext(optional: false): TContextMenuRootContext;
export function useContextMenuRootContext(optional?: true): TContextMenuRootContext | undefined;
export function useContextMenuRootContext(optional = true) {
    const context = React.use(ContextMenuRootContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: ContextMenuRootContext is missing. ContextMenu parts must be placed within <ContextMenu.Root>.'
        );
    }

    return context;
}
