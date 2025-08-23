'use client';

import React from 'react';

export type TFieldsetRootContext = {
    legendId: string | undefined;
    setLegendId: React.Dispatch<React.SetStateAction<string | undefined>>;
    disabled: boolean | undefined;
};

export const FieldsetRootContext = React.createContext<TFieldsetRootContext>({
    legendId: undefined,
    setLegendId: () => {},
    disabled: undefined
});

export function useFieldsetRootContext() {
    return React.use(FieldsetRootContext);
}
