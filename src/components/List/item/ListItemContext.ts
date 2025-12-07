import React from 'react';

export type ListItemContextValue = {
    index: number;
    setSubheaderId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const ListItemContext = React.createContext<ListItemContextValue | undefined>(undefined);

export function useListItemContext() {
    const context = React.use(ListItemContext);

    if (!context) {
        throw new Error('Headless UI: ListItemContext is missing. ListItem parts must be placed within <List.Item>.'
        );
    }

    return context;
}
