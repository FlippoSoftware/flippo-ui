import React from 'react';

import type { ListStore } from '../store';

export type ListRootContextValue = {
    store: ListStore;
};

export const ListRootContext = React.createContext<ListRootContextValue | undefined>(undefined);

export function useListRootContext(optional?: false): ListRootContextValue;
export function useListRootContext(optional: true): ListRootContextValue | undefined;
export function useListRootContext(optional?: boolean) {
    const listRootContext = React.use(ListRootContext);

    if (optional === false && listRootContext === undefined) {
        throw new Error(
            'Headless UI: ListRootContext is missing. List parts must be placed within <List.Root>.'
        );
    }

    return listRootContext;
}
