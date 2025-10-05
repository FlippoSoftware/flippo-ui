import React from 'react';

import type { CheckboxRoot } from './CheckboxRoot';

export type CheckboxRootContextValue = CheckboxRoot.State;

export const CheckboxRootContext = React.createContext<CheckboxRootContextValue | undefined>(undefined);

export function useCheckboxRootContext() {
    const context = React.use(CheckboxRootContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: CheckboxRootContext is missing. Checkbox parts must be placed within <Checkbox.Root>.'
        );
    }

    return context;
}
