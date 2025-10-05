import React from 'react';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';

import type { useFieldControlValidation } from '../Field/control/useFieldControlValidation';

import type { useCheckboxGroupParent } from './useCheckboxGroupParent';

export type CheckboxGroupContextValue = {
    value: string[] | undefined;
    defaultValue: string[] | undefined;
    setValue: (value: string[], eventDetails: HeadlessUIChangeEventDetails<'none'>) => void;
    allValues: string[] | undefined;
    parent: useCheckboxGroupParent.ReturnValue;
    disabled: boolean;
    fieldControlValidation: useFieldControlValidation.ReturnValue;
    registerControlRef: (element: HTMLButtonElement | null) => void;
};

export const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | undefined>(
    undefined
);

export function useCheckboxGroupContext(optional: false): CheckboxGroupContextValue;
export function useCheckboxGroupContext(optional?: true): CheckboxGroupContextValue | undefined;
export function useCheckboxGroupContext(optional = true) {
    const context = React.use(CheckboxGroupContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: CheckboxGroupContext is missing. CheckboxGroup parts must be placed within <CheckboxGroup>.'
        );
    }

    return context;
}
