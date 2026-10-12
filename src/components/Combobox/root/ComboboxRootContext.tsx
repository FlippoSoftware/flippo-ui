import React from 'react';

import type { ComboboxRootMachine, ComboboxStore } from '@flippo-software/core-components/combobox';

export type ComboboxDerivedItemsContextValue = {
    query: string;
    filteredItems: readonly any[];
    flatFilteredItems: readonly any[];
};

/**
 * The store of the combobox's state (the root machine's `store`).
 */
export const ComboboxRootContext = React.createContext<ComboboxStore | undefined>(undefined);
export const ComboboxRootMachineContext = React.createContext<ComboboxRootMachine | undefined>(undefined);
export const ComboboxDerivedItemsContext = React.createContext<ComboboxDerivedItemsContextValue | undefined>(undefined);
// `inputValue` can't be placed in the store.
// https://github.com/mui/base-ui/issues/2703
export const ComboboxInputValueContext = React.createContext<React.ComponentProps<'input'>['value']>('');

export function useComboboxRootContext() {
    const context = React.use(ComboboxRootContext);
    if (!context) {
        throw new Error('Headless UI: ComboboxRootContext is missing. Combobox parts must be placed within <Combobox.Root>.');
    }
    return context;
}

export function useComboboxRootMachine() {
    const context = React.use(ComboboxRootMachineContext);
    if (!context) {
        throw new Error('Headless UI: ComboboxRootContext is missing. Combobox parts must be placed within <Combobox.Root>.');
    }
    return context;
}

export function useComboboxDerivedItemsContext() {
    const context = React.use(ComboboxDerivedItemsContext);
    if (!context) {
        throw new Error('Headless UI: ComboboxItemsContext is missing. Combobox parts must be placed within <Combobox.Root>.');
    }
    return context;
}

export function useComboboxInputValueContext() {
    return React.use(ComboboxInputValueContext);
}
