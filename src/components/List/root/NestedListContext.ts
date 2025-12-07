import React from 'react';

export type NestedListContextValue = {
    nestedListItemNumber: number;
    subheaderId: string | undefined;
};

export const NestedListContext = React.createContext<NestedListContextValue | undefined>(undefined);

export function useNestedListContext(optional?: false): NestedListContextValue;
export function useNestedListContext(optional: true): NestedListContextValue | undefined;
export function useNestedListContext(optional?: boolean) {
    const context = React.use(NestedListContext);

    if (!optional && context === undefined) {
        throw new Error(
            'Headless UI: NestedListContext is missing. NestedList parts must be placed within <List.Item>.'
        );
    }

    return context;
}
