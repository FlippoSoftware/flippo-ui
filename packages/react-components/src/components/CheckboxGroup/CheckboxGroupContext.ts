import React from 'react';

import type { CheckboxGroupMachine, CheckboxGroupParent } from '@flippo-software/core-components/checkbox-group';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIEventReasons } from '~@lib/reason';

import type { UseFieldValidationReturnValue } from '../Field/root/useFieldValidation';

export type CheckboxGroupContextValue = {
    value: string[] | undefined;
    defaultValue: string[] | undefined;
    setValue: (value: string[], eventDetails: HeadlessUIChangeEventDetails<HeadlessUIEventReasons['none']>) => void;
    allValues: string[] | undefined;
    parent: CheckboxGroupParent;
    disabled: boolean;
    validation: UseFieldValidationReturnValue;
    registerControlRef: (element: HTMLButtonElement | null) => void;
    /**
     * The core machine of the group.
     */
    group: CheckboxGroupMachine;
};

export const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | undefined>(undefined);

export function useCheckboxGroupContext(optional: false): CheckboxGroupContextValue;
export function useCheckboxGroupContext(optional?: true): CheckboxGroupContextValue | undefined;
export function useCheckboxGroupContext(optional = true) {
    const context = React.use(CheckboxGroupContext);
    if (context === undefined && !optional) {
        throw new Error('Headless UI: CheckboxGroupContext is missing. CheckboxGroup parts must be placed within <CheckboxGroup>.');
    }

    return context;
}
