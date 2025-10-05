import React from 'react';

import { NOOP } from '~@lib/noop';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';

import type { useFieldControlValidation } from '../Field/control/useFieldControlValidation';

export type RadioGroupContextValue = {
    disabled: boolean | undefined;
    readOnly: boolean | undefined;
    required: boolean | undefined;
    name: string | undefined;
    checkedValue: unknown;
    setCheckedValue: (value: unknown, eventDetails: HeadlessUIChangeEventDetails<'none'>) => void;
    onValueChange: (value: unknown, eventDetails: HeadlessUIChangeEventDetails<'none'>) => void;
    touched: boolean;
    setTouched: React.Dispatch<React.SetStateAction<boolean>>;
    fieldControlValidation?: ReturnType<typeof useFieldControlValidation>;
    registerControlRef: (element: HTMLElement | null) => void;
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
