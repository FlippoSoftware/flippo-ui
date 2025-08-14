'use client';

import React from 'react';

export type TToolbarGroupContext = {
    disabled: boolean;
};

export const ToolbarGroupContext = React.createContext<TToolbarGroupContext | undefined>(undefined);

export function useToolbarGroupContext(optional?: false): TToolbarGroupContext;
export function useToolbarGroupContext(optional: true): TToolbarGroupContext | undefined;
export function useToolbarGroupContext(optional?: boolean) {
    const context = React.use(ToolbarGroupContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: ToolbarGroupContext is missing. ToolbarGroup parts must be placed within <Toolbar.Group>.'
        );
    }
    return context;
}
