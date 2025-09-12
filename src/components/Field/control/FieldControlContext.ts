import React from 'react';

import type { FieldRoot } from '../root/FieldRoot';

export type TFieldControlContext = {
    state: FieldRoot.State;
    control: 'input' | 'textarea';
    value: React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>['defaultValue'];
    controlProps: React.JSX.IntrinsicElements['input' | 'textarea'];
    controlRef: React.RefCallback<HTMLElement> | null;
    setValue: (value: string, event: Event) => void;
};

export const FieldControlContext = React.createContext<TFieldControlContext | undefined>(undefined);

export function useFieldControlContext() {
    const context = React.use(FieldControlContext);

    if (!context) {
        throw new Error('Headless UI: FieldControlContext is missing. Control parts must be placed within <Field.Control>.');
    }

    return context;
}
