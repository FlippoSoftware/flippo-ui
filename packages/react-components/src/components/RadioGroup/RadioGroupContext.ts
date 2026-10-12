import React from 'react';

import type { RadioGroupMachine } from '@flippo-software/core-components/radio-group';

import { NOOP } from '~@lib/noop';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIEventReasons } from '~@lib/reason';

import type { UseFieldValidationReturnValue } from '../Field/root/useFieldValidation';

export type RadioGroupContextValue = {
    disabled: boolean | undefined;
    readOnly: boolean | undefined;
    required: boolean | undefined;
    name: string | undefined;
    checkedValue: unknown;
    setCheckedValue: (value: unknown, eventDetails: HeadlessUIChangeEventDetails<HeadlessUIEventReasons['none']>) => void;
    onValueChange: (value: unknown, eventDetails: HeadlessUIChangeEventDetails<HeadlessUIEventReasons['none']>) => void;
    touched: boolean;
    setTouched: React.Dispatch<React.SetStateAction<boolean>>;
    validation?: UseFieldValidationReturnValue;
    registerControlRef: (element: HTMLElement | null) => void;
    /**
     * The core machine of the group (absent outside of a group).
     */
    group?: RadioGroupMachine;
};

export const RadioGroupContext = React.createContext<RadioGroupContextValue>({
    disabled: undefined,
    readOnly: undefined,
    required: undefined,
    name: undefined,
    checkedValue: '',
    setCheckedValue: NOOP,
    onValueChange: NOOP,
    touched: false,
    setTouched: NOOP,
    registerControlRef: NOOP
});

export function useRadioGroupContext() {
    return React.use(RadioGroupContext);
}
