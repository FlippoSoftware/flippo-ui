import React from 'react';

import type { ContextMenuRootMachine } from '@flippo-software/core-components/context-menu';

export type ContextMenuRootContextValue = ContextMenuRootMachine;

export const ContextMenuRootContext = React.createContext<ContextMenuRootContextValue | undefined>(undefined);

export function useContextMenuRootContext(optional: false): ContextMenuRootContextValue;
export function useContextMenuRootContext(optional?: true): ContextMenuRootContextValue | undefined;
export function useContextMenuRootContext(optional = true) {
    const context = React.use(ContextMenuRootContext);
    if (context === undefined && !optional) {
        throw new Error('Headless UI: ContextMenuRootContext is missing. ContextMenu parts must be placed within <ContextMenu.Root>.');
    }

    return context;
}
