import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { EMPTY_OBJECT } from '~@lib/constants';
import { createGenericEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIGenericEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { FormContext } from './FormContext';

import type { FormContextValue } from './FormContext';

/**
 * A native form element with consolidated error handling.
 * Renders a `<form>` element.
 *
 * Documentation: [Base UI Form](https://base-ui.com/react/components/form)
 */
export function Form<
    FormValues extends Record<string, any> = Record<string, any>,
>(componentProps: Form.Props<FormValues>) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        validationMode = 'onSubmit',
        errors: externalErrors,
        onSubmit,
        onFormSubmit,
        ref,
        ...elementProps
    } = componentProps;

    const formRef = React.useRef<FormContextValue['formRef']['current']>({
        fields: new Map()
    });
    const submittedRef = React.useRef(false);
    const submitAttemptedRef = React.useRef(false);

    const focusControl = useEventCallback((control: HTMLElement | null) => {
        if (!control) {
            return;
        }
        control.focus();
        if (control.tagName === 'INPUT') {
            (control as HTMLInputElement).select();
        }
    });

    const [errors, setErrors] = React.useState(externalErrors);

    useValueChanged(externalErrors, () => {
        setErrors(externalErrors);
    });

    React.useEffect(() => {
        if (!submittedRef.current) {
            return;
        }

        submittedRef.current = false;

        const invalidFields = Array.from(formRef.current.fields.values()).filter(
            (field) => field.validityData.state.valid === false
        );

        if (invalidFields.length) {
            focusControl(invalidFields[0]?.controlRef.current ?? null);
        }
    }, [errors, focusControl]);

    const element = useRenderElement('form', componentProps, {
        ref,
        props: [{
            noValidate: true,
            onSubmit(event) {
                submitAttemptedRef.current = true;

                let values = Array.from(formRef.current.fields.values());

                // Async validation isn't supported to stop the submit event.
                values.forEach((field) => {
                    field.validate();
                });

                values = Array.from(formRef.current.fields.values());

                const invalidFields = values.filter((field) => !field.validityData.state.valid);

                if (invalidFields.length) {
                    event.preventDefault();
                    focusControl(invalidFields[0]?.controlRef.current ?? null);
                }
                else {
                    submittedRef.current = true;
                    onSubmit?.(event as any);

                    if (onFormSubmit) {
                        event.preventDefault();

                        const formValues = values.reduce((acc, field) => {
                            if (field.name) {
                                (acc as Record<string, any>)[field.name] = field.getValue();
                            }
                            return acc;
                        }, {} as FormValues);

                        onFormSubmit(formValues, createGenericEventDetails(REASONS.none, event.nativeEvent));
                    }
                }
            }
        }, elementProps]
    });

    const clearErrors = useEventCallback((name: string | undefined) => {
        if (name && errors && EMPTY_OBJECT.hasOwnProperty.call(errors, name)) {
            const nextErrors = { ...errors };
            delete nextErrors[name];
            setErrors(nextErrors);
        }
    });

    const contextValue: FormContextValue = React.useMemo(
        () => ({
            formRef,
            validationMode,
            errors: errors ?? EMPTY_OBJECT,
            clearErrors,
            submitAttemptedRef
        }),
        [formRef, validationMode, errors, clearErrors]
    );

    return <FormContext.Provider value={contextValue}>{element}</FormContext.Provider>;
}

export type FormSubmitEventReason = typeof REASONS.none;
export type FormSubmitEventDetails = HeadlessUIGenericEventDetails<Form.SubmitEventReason>;

export type FormState = {};

export type FormProps<FormValues extends Record<string, any> = Record<string, any>> = {
    /**
     * Determines when the form should be validated.
     * The `validationMode` prop on `<Field.Root>` takes precedence over this.
     *
     * - `onSubmit` (default): validates the field when the form is submitted, afterwards fields will re-validate on change.
     * - `onBlur`: validates a field when it loses focus.
     * - `onChange`: validates the field on every change to its value.
     *
     * @default 'onSubmit'
     */
    validationMode?: FormValidationMode;
    /**
     * Validation errors returned externally, typically after submission by a server or a form action.
     * This should be an object where keys correspond to the `name` attribute on `<Field.Root>`,
     * and values correspond to error(s) related to that field.
     */
    errors?: FormContextValue['errors'];
    /**
     * Event handler called when the form is submitted.
     * `preventDefault()` is called on the native submit event when used.
     */
    onFormSubmit?: (formValues: FormValues, eventDetails: Form.SubmitEventDetails) => void;
} & HeadlessUIComponentProps<'form', Form.State>;

export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange';

export namespace Form {
    export type Props<FormValues extends Record<string, any> = Record<string, any>>
        = FormProps<FormValues>;
    export type State = FormState;
    export type ValidationMode = FormValidationMode;
    export type SubmitEventReason = FormSubmitEventReason;
    export type SubmitEventDetails = FormSubmitEventDetails;

    export type Values<FormValues extends Record<string, any> = Record<string, any>> = FormValues;
}
