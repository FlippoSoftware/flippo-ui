import React from 'react';

import { FieldRootMachine } from '@flippo-software/core-components/field';
import { useEventCallback, useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useFormContext } from '../Form/FormContext';

import { useFieldRootContext } from './root/FieldRootContext';

/**
 * Registers a control in the form through its field (core `FieldRootMachine.registerControl`):
 * submitting validates it and reads its value. Controls outside of `Field.Root` still join an enclosing form.
 */
export function useField(params: useField.Parameters) {
    const { enabled = true, value, id, name, controlRef, commit } = params;

    const { field, validityData, invalid } = useFieldRootContext();
    const { form } = useFormContext();

    // Outside of `Field.Root`, a field of its own registers the control in the form.
    const [fallbackField] = React.useState(() => (field ? null : new FieldRootMachine({ form })));
    const registeringField = field ?? (fallbackField as FieldRootMachine);

    const getValue = useEventCallback(params.getValue ?? (() => undefined));

    useIsoLayoutEffect(
        () => registeringField.registerControl({ id, name, value, getValue, controlRef, commit, enabled }),
        // The registration stores the current validity: register again when it changes.
        [registeringField, id, name, value, getValue, controlRef, commit, enabled, validityData, invalid]
    );
}

export namespace useField {
    export type Parameters = {
        enabled?: boolean;
        value: unknown;
        getValue?: (() => unknown) | undefined;
        id: string | undefined;
        name?: string | undefined;
        commit: (value: unknown) => void;
        /**
         * A ref to a focusable element that receives focus when the field fails
         * validation during form submission.
         */
        controlRef: React.RefObject<any>;
    };
}
