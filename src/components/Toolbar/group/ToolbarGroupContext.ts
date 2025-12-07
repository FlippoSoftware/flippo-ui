import React from 'react';

export type ToolbarGroupContextValue = {
    disabled: boolean;
};

export const ToolbarGroupContext = React.createContext<ToolbarGroupContextValue | undefined>(undefined);

export function useToolbarGroupContext(optional?: false): ToolbarGroupContextValue;
export function useToolbarGroupContext(optional: true): ToolbarGroupContextValue | undefined;
export function useToolbarGroupContext(optional?: boolean) {
    const context = React.use(ToolbarGroupContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: ToolbarGroupContext is missing. ToolbarGroup parts must be placed within <Toolbar.Group>.'
        );
    }
    return context;
}
