'use client';
import * as React from 'react';

import { NOOP } from '@lib/noop';

import type { FieldValidityData } from '../Field/root/FieldRoot';

export type Errors = Record<string, string | string[]>;

export type TFormContext = {
    errors: Errors;
    clearErrors: (name: string | undefined) => void;
    formRef: React.RefObject<{
        fields: Map<
            string,
            {
                name: string | undefined;
                validate: () => void;
                validityData: FieldValidityData;
                controlRef: React.RefObject<HTMLElement>;
                getValueRef: React.RefObject<(() => unknown) | undefined>;
            }
        >;
    }>;
};

export const FormContext = React.createContext<TFormContext>({
    formRef: {
        current: {
            fields: new Map()
        }
    },
    errors: {},
    clearErrors: NOOP
});

export function useFormContext() {
    return React.use(FormContext);
}
