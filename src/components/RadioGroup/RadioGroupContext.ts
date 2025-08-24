'use client';

import React from 'react';

import { NOOP } from '@lib/noop';

import type { useFieldControlValidation } from '../Field/control/useFieldControlValidation';

export type TRadioGroupContext = {
    disabled: boolean | undefined;
    readOnly: boolean | undefined;
    required: boolean | undefined;
    name: string | undefined;
    checkedValue: unknown;
    setCheckedValue: React.Dispatch<React.SetStateAction<unknown>>;
    onValueChange: (value: unknown, event: Event) => void;
    touched: boolean;
    setTouched: React.Dispatch<React.SetStateAction<boolean>>;
    fieldControlValidation?: ReturnType<typeof useFieldControlValidation>;
    registerControlRef: (element: HTMLElement | null) => void;
};

export const RadioGroupContext = React.createContext<TRadioGroupContext>({
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
