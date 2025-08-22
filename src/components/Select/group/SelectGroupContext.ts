import React from 'react';

export type TSelectGroupContext = {
    labelId: string | undefined;
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const SelectGroupContext = React.createContext<TSelectGroupContext | undefined>(undefined);

export function useSelectGroupContext() {
    const context = React.use(SelectGroupContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: SelectGroupContext is missing. SelectGroup parts must be placed within <Select.Group>.'
        );
    }

    return context;
}
