import React from 'react';

import type { FloatingRootContext } from '~@packages/floating-ui-react';

import type { ComboboxStore } from '../store';

export type ComboboxDerivedItemsContextValue = {
    query: string;
    filteredItems: any[];
    flatFilteredItems: any[];
};

export const ComboboxRootContext = React.createContext<ComboboxStore | undefined>(undefined);
export const ComboboxFloatingContext = React.createContext<FloatingRootContext | undefined>(
    undefined
);
export const ComboboxDerivedItemsContext = React.createContext<
  ComboboxDerivedItemsContextValue | undefined
>(undefined);
// `inputValue` can't be placed in the store.
// https://github.com/mui/base-ui/issues/2703
export const ComboboxInputValueContext
  = React.createContext<React.ComponentProps<'input'>['value']>('');

export function useComboboxRootContext() {
    const context = React.use(ComboboxRootContext) as ComboboxStore | undefined;
    if (!context) {
        throw new Error(
            'Headless UI: ComboboxRootContext is missing. Combobox parts must be placed within <Combobox.Root>.'
        );
    }
    return context;
}

export function useComboboxFloatingContext() {
    const context = React.use(ComboboxFloatingContext);
    if (!context) {
        throw new Error(
            'Headless UI: ComboboxFloatingContext is missing. Combobox parts must be placed within <Combobox.Root>.'
        );
    }
    return context;
}

export function useComboboxDerivedItemsContext() {
    const context = React.use(ComboboxDerivedItemsContext);
    if (!context) {
        throw new Error(
            'Headless UI: ComboboxItemsContext is missing. Combobox parts must be placed within <Combobox.Root>.'
        );
    }
    return context;
}

export function useComboboxInputValueContext() {
    return React.use(ComboboxInputValueContext);
}
