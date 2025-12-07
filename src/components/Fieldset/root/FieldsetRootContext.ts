import React from 'react';

export type FieldsetRootContextValue = {
    legendId: string | undefined;
    setLegendId: React.Dispatch<React.SetStateAction<string | undefined>>;
    disabled: boolean | undefined;
};

export const FieldsetRootContext = React.createContext<FieldsetRootContextValue>({
    legendId: undefined,
    setLegendId: () => {},
    disabled: undefined
});

export function useFieldsetRootContext(optional: true): FieldsetRootContextValue | undefined;
export function useFieldsetRootContext(optional?: false): FieldsetRootContextValue;
export function useFieldsetRootContext(optional = false) {
    const context = React.use(FieldsetRootContext);
    if (!context && !optional) {
        throw new Error(
            'Headless UI: FieldsetRootContext is missing. Fieldset parts must be placed within <Fieldset.Root>.'
        );
    }
    return context;
}
