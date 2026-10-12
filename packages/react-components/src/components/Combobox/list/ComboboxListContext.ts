import React from 'react';

import type { ComboboxListMachine } from '@flippo-software/core-components/combobox';

/**
 * The list machine: items register in its registry (DOM order, labels for typeahead).
 */
export const ComboboxListContext = React.createContext<ComboboxListMachine | undefined>(undefined);

export function useComboboxListContext() {
    return React.use(ComboboxListContext);
}
