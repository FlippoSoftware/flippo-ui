import React from 'react';

import type { CheckboxCardRoot } from './CheckboxCardRoot';

export type CheckboxCardRootContextValue = CheckboxCardRoot.State;

export const CheckboxCardRootContext = React.createContext<CheckboxCardRootContextValue | undefined>(undefined);

export function useCheckboxCardRootContext() {
    const value = React.use(CheckboxCardRootContext);
    if (value === undefined) {
        throw new Error(
            'Headless UI: CheckboxCardRootContext is missing. CheckboxCard.Indicator must be placed within <CheckboxCard.Root>.'
        );
    }

    return value;
}
