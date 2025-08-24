import React from 'react';

export type TMenuRadioGroupContext = {
    value: any;
    setValue: (newValue: any, event: Event) => void;
    disabled: boolean;
};

export const MenuRadioGroupContext = React.createContext<TMenuRadioGroupContext | undefined>(
    undefined
);

export function useMenuRadioGroupContext() {
    const context = React.use(MenuRadioGroupContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: MenuRadioGroupContext is missing. MenuRadioGroup parts must be placed within <Menu.RadioGroup>.'
        );
    }

    return context;
}
