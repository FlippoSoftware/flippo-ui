import React from 'react';

import type { ContextMenuRoot } from './ContextMenuRoot';

export type ContextMenuRootContextValue = {
    anchor: { getBoundingClientRect: () => DOMRect };
    setAnchor: React.Dispatch<React.SetStateAction<ContextMenuRootContextValue['anchor']>>;
    backdropRef: React.RefObject<HTMLDivElement | null>;
    internalBackdropRef: React.RefObject<HTMLDivElement | null>;
    actionsRef: React.RefObject<{
        setOpen: (nextOpen: boolean, eventDetails: ContextMenuRoot.ChangeEventDetails) => void;
    } | null>;
    positionerRef: React.RefObject<HTMLElement | null>;
    allowMouseUpTriggerRef: React.RefObject<boolean>;
    initialCursorPointRef: React.RefObject<{ x: number; y: number } | null>;
    rootId: string | undefined;
};

export const ContextMenuRootContext = React.createContext<ContextMenuRootContextValue | undefined>(
    undefined
);

export function useContextMenuRootContext(optional: false): ContextMenuRootContextValue;
export function useContextMenuRootContext(optional?: true): ContextMenuRootContextValue | undefined;
export function useContextMenuRootContext(optional = true) {
    const context = React.use(ContextMenuRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: ContextMenuRootContext is missing. ContextMenu parts must be placed within <ContextMenu.Root>.'
        );
    }

    return context;
}
