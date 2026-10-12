import React from 'react';

export type FieldItemContextValue = {
    disabled: boolean;
};

export const FieldItemContext = React.createContext<FieldItemContextValue>({ disabled: false });

export function useFieldItemContext() {
    const context = React.use(FieldItemContext);

    return context;
}
