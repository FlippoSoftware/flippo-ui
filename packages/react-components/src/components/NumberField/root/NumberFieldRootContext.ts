import React from 'react';

import type { NumberFieldMachine } from '@flippo-software/core-components/number-field';

import type { NumberFieldRoot } from './NumberFieldRoot';

export type NumberFieldRootContextValue = {
    /**
     * The core machine: value, input text, stepping, auto-change and field integration.
     */
    numberField: NumberFieldMachine;
    state: NumberFieldRoot.State;
};

export const NumberFieldRootContext = React.createContext<NumberFieldRootContextValue | undefined>(undefined);

export function useNumberFieldRootContext() {
    const context = React.use(NumberFieldRootContext);
    if (context === undefined) {
        throw new Error('Headless UI: NumberFieldRootContext is missing. NumberField parts must be placed within <NumberField.Root>.');
    }
    return context;
}
