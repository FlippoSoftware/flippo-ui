import React from 'react';

import { NOOP } from '@lib/noop';

import type { useFieldControlValidation } from '../../Field/control/useFieldControlValidation';

import type { PinInputRoot } from './PinInputRoot';

export type PinInputRootContextValue = {
    mask: boolean;
    otp: boolean;
    name?: string;
    pattern?: string;
    type?: 'alphanumeric' | 'numeric' | 'alphabetic';
    blurOnComplete: boolean;
    selectOnFocus: boolean;
    checkedValue: string;
    touched: boolean;
    placeholder: string;
    fieldControlValidation?: ReturnType<typeof useFieldControlValidation>;
    values: string[];
    state: PinInputRoot.State;
    controlRef: React.RefObject<HTMLElement | null>;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    setFilled: React.Dispatch<React.SetStateAction<boolean>>;
    setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    setValues: React.Dispatch<React.SetStateAction<string[]>>;
    setCheckedValue: React.Dispatch<React.SetStateAction<string>>;
    setTouched: React.Dispatch<React.SetStateAction<boolean>>;
    registerControlRef: (element: HTMLElement | null) => void;
    onValueChange: (pinValue: string, index: number, event: Event) => void;
};

export const PinInputRootContext = React.createContext<PinInputRootContextValue>({
    mask: false,
    otp: false,
    blurOnComplete: false,
    selectOnFocus: false,
    name: undefined,
    checkedValue: '',
    placeholder: '',
    values: [],
    touched: false,
    state: {
        completed: false,
        readOnly: false,
        disabled: false,
        touched: false,
        dirty: false,
        valid: null,
        filled: false,
        focused: false
    },
    controlRef: { current: null },
    setFocused: NOOP,
    setCompleted: NOOP,
    setDirty: NOOP,
    setFilled: NOOP,
    setValues: NOOP,
    setCheckedValue: NOOP,
    onValueChange: NOOP,
    setTouched: NOOP,
    registerControlRef: NOOP
});

export function usePinInputRootContext() {
    const context = React.use(PinInputRootContext);

    if (!context) {
        throw new Error('Headless UI: usePinInputRootContext must be used within a PinInputRootContext');
    }

    return context;
}
