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
    readOnly: boolean;
    focusedInputIndex: number | null;
    lastFocusedInputIndex: number | null;
    fieldControlValidation?: ReturnType<typeof useFieldControlValidation>;
    values: string[];
    state: PinInputRoot.State;
    controlRef: React.RefObject<HTMLElement | null>;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
    setFocusedInputIndex: React.Dispatch<React.SetStateAction<number | null>>;
    setLastFocusedInputIndex: React.Dispatch<React.SetStateAction<number | null>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    setFilled: React.Dispatch<React.SetStateAction<boolean>>;
    setValues: React.Dispatch<React.SetStateAction<string[]>>;
    setCheckedValue: React.Dispatch<React.SetStateAction<string>>;
    setTouched: React.Dispatch<React.SetStateAction<boolean>>;
    registerControlRef: (element: HTMLElement | null) => void;
    onValueChange: (pinValue: string, index: number, event: Event) => void;
};

export const PinInputRootContext = React.createContext<PinInputRootContextValue>({
    mask: false,
    otp: false,
    focusedInputIndex: null,
    readOnly: false,
    blurOnComplete: false,
    selectOnFocus: false,
    name: undefined,
    checkedValue: '',
    placeholder: '',
    values: [],
    touched: false,
    state: {
        readOnly: false,
        disabled: false,
        touched: false,
        dirty: false,
        valid: null,
        filled: false,
        focused: false
    },
    lastFocusedInputIndex: null,
    controlRef: { current: null },
    setLastFocusedInputIndex: NOOP,
    setFocused: NOOP,
    setFocusedInputIndex: NOOP,
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
