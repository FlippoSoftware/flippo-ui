'use client';

import React from 'react';

import type { useFieldControlValidation } from '../Field/control/useFieldControlValidation';

import type { useCheckboxGroupParent } from './useCheckboxGroupParent';

export type TCheckboxGroupContext = {
    value: string[] | undefined;
    defaultValue: string[] | undefined;
    setValue: (value: string[], event: Event) => void;
    allValues: string[] | undefined;
    parent: useCheckboxGroupParent.ReturnValue;
    disabled: boolean;
    fieldControlValidation: useFieldControlValidation.ReturnValue;
    registerControlRef: (element: HTMLButtonElement | null) => void;
};

export const CheckboxGroupContext = React.createContext<TCheckboxGroupContext | undefined>(
    undefined
);

export function useCheckboxGroupContext(optional: false): TCheckboxGroupContext;
export function useCheckboxGroupContext(optional?: true): TCheckboxGroupContext | undefined;
export function useCheckboxGroupContext(optional = true) {
    const context = React.use(CheckboxGroupContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: CheckboxGroupContext is missing. CheckboxGroup parts must be placed within <CheckboxGroup>.'
        );
    }

    return context;
}
