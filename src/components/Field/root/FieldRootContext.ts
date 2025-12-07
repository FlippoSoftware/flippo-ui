import React from 'react';

import { EMPTY_OBJECT } from '~@lib/constants';
import { NOOP } from '~@lib/noop';

import type { HTMLProps } from '~@lib/types';

import { DEFAULT_VALIDITY_STATE } from '../utils/constants';

import type { Form } from '../../Form';

import type { FieldRoot, FieldValidityData } from './FieldRoot';
import type { UseFieldValidationReturnValue } from './useFieldValidation';

export type FieldRootContextValue = {
    invalid: boolean | undefined;
    name: string | undefined;
    validityData: FieldValidityData;
    setValidityData: React.Dispatch<React.SetStateAction<FieldValidityData>>;
    disabled: boolean | undefined;
    touched: boolean;
    setTouched: React.Dispatch<React.SetStateAction<boolean>>;
    dirty: boolean;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    filled: boolean;
    setFilled: React.Dispatch<React.SetStateAction<boolean>>;
    focused: boolean;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
    validate: (
        value: unknown,
        formValues: Record<string, unknown>,
    ) => string | string[] | null | Promise<string | string[] | null>;
    validationMode: Form.ValidationMode;
    validationDebounceTime: number;
    shouldValidateOnChange: () => boolean;
    state: FieldRoot.State;
    markedDirtyRef: React.RefObject<boolean>;
    validation: UseFieldValidationReturnValue;
};

export const FieldRootContext = React.createContext<FieldRootContextValue>({
    invalid: undefined,
    name: undefined,
    validityData: {
        state: DEFAULT_VALIDITY_STATE,
        errors: [],
        error: '',
        value: '',
        initialValue: null
    },
    setValidityData: NOOP,
    disabled: undefined,
    touched: false,
    setTouched: NOOP,
    dirty: false,
    setDirty: NOOP,
    filled: false,
    setFilled: NOOP,
    focused: false,
    setFocused: NOOP,
    validate: () => null,
    validationMode: 'onSubmit',
    validationDebounceTime: 0,
    shouldValidateOnChange: () => false,
    state: {
        disabled: false,
        valid: null,
        touched: false,
        dirty: false,
        filled: false,
        focused: false
    },
    markedDirtyRef: { current: false },
    validation: {
        getValidationProps: (props: HTMLProps = EMPTY_OBJECT) => props,
        getInputValidationProps: (props: HTMLProps = EMPTY_OBJECT) => props,
        inputRef: { current: null },
        commit: async () => {}
    }
});

export function useFieldRootContext(optional = true) {
    const context = React.use(FieldRootContext);

    if (context.setValidityData === NOOP && !optional) {
        throw new Error(
            'Headless UI: FieldRootContext is missing. Field parts must be placed within <Field.Root>.'
        );
    }

    return context;
}
