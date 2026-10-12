import React from 'react';

import type { ToolbarMachine } from '@flippo-software/core-components/toolbar';

import type { Orientation } from '~@lib/types';

export type ToolbarRootContextValue = {
    disabled: boolean;
    orientation: Orientation;
    /**
     * The core machine of the toolbar (composite navigation, disabled items).
     */
    toolbar: ToolbarMachine;
};

export const ToolbarRootContext = React.createContext<ToolbarRootContextValue | undefined>(undefined);

export function useToolbarRootContext(optional?: false): ToolbarRootContextValue;
export function useToolbarRootContext(optional: true): ToolbarRootContextValue | undefined;
export function useToolbarRootContext(optional?: boolean) {
    const context = React.use(ToolbarRootContext);

    if (context === undefined && !optional) {
        throw new Error('Headless UI: ToolbarRootContext is missing. Toolbar parts must be placed within <Toolbar.Root>.');
    }

    return context;
}
