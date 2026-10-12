import React from 'react';

import type { ComboboxChipsMachine } from '@flippo-software/core-components/combobox';

export type ComboboxChipsContextValue = ComboboxChipsMachine;

export const ComboboxChipsContext = React.createContext<ComboboxChipsContextValue | undefined>(undefined);

export function useComboboxChipsContext() {
    return React.use(ComboboxChipsContext);
}
