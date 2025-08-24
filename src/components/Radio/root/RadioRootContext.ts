'use client';

import React from 'react';

export type TRadioRootContext = {
    disabled: boolean;
    readOnly: boolean;
    checked: boolean;
    required: boolean;
};

export const RadioRootContext = React.createContext<TRadioRootContext | undefined>(undefined);

export function useRadioRootContext() {
    const value = React.use(RadioRootContext);

    if (value === undefined) {
        throw new Error(
            'Headless UI: RadioRootContext is missing. Radio parts must be placed within <Radio.Root>.'
        );
    }

    return value;
}
