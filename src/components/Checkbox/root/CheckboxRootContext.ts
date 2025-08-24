'use client';

import React from 'react';

import type { CheckboxRoot } from './CheckboxRoot';

export type TCheckboxRootContext = CheckboxRoot.State;

export const CheckboxRootContext = React.createContext<TCheckboxRootContext | undefined>(undefined);

export function useCheckboxRootContext() {
    const context = React.use(CheckboxRootContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: CheckboxRootContext is missing. Checkbox parts must be placed within <Checkbox.Root>.'
        );
    }

    return context;
}
