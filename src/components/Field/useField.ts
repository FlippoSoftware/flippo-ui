import ReactDOM from 'react-dom';

import { useEventCallback, useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useFormContext } from '../Form/FormContext';

import { useFieldRootContext } from './root/FieldRootContext';
import { getCombinedFieldValidityData } from './utils/getCombinedFieldValidityData';

export function useField(params: useField.Parameters) {
    const {
        enabled = true,
        value,
        id,
        name,
        controlRef,
        commit
    } = params;

    const { formRef } = useFormContext();
    const {
        invalid,
        markedDirtyRef,
        validityData,
        setValidityData
    } = useFieldRootContext();

    const getValue = useEventCallback(params.getValue);

    useIsoLayoutEffect(() => {
        if (!enabled) {
            return;
        }

        let initialValue = value;
        if (initialValue === undefined) {
            initialValue = getValue();
        }

        if (validityData.initialValue === null && initialValue !== null) {
            setValidityData((prev) => ({ ...prev, initialValue }));
        }
    }, [
        enabled,
        setValidityData,
        value,
        validityData.initialValue,
        getValue
    ]);

    useIsoLayoutEffect(() => {
        if (!enabled || !id) {
            return;
        }

        formRef.current.fields.set(id, {
            getValue,
            name,
            controlRef,
            validityData: getCombinedFieldValidityData(validityData, invalid),
            validate() {
                let nextValue = value;
                if (nextValue === undefined) {
                    nextValue = getValue();
                }

                markedDirtyRef.current = true;
                // Synchronously update the validity state so the submit event can be prevented.
                ReactDOM.flushSync(() => commit(nextValue));
            }
        });
    }, [
        commit,
        controlRef,
        enabled,
        formRef,
        getValue,
        id,
        invalid,
        markedDirtyRef,
        name,
        validityData,
        value
    ]);

    useIsoLayoutEffect(() => {
        const fields = formRef.current.fields;
        return () => {
            if (id) {
                fields.delete(id);
            }
        };
    }, [formRef, id]);
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
