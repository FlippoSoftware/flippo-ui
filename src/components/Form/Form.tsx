import React from 'react';

import { FormController } from '@flippo-software/core-components/form';

import { EMPTY_OBJECT } from '~@lib/constants';
import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIGenericEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { FormContext } from './FormContext';

import type { FormContextValue } from './FormContext';

/**
 * A native form element with consolidated error handling.
 * Renders a `<form>` element.
 *
 * Documentation: [Base UI Form](https://base-ui.com/react/components/form)
 */
export function Form<FormValues extends Record<string, any> = Record<string, any>>(componentProps: Form.Props<FormValues>) {
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

    const form = useMachine((options) => new FormController<FormValues>(options), {
        validationMode,
        errors: externalErrors,
        onSubmit: onSubmit as never,
        onFormSubmit: onFormSubmit as never
    });
    const { errors } = useStoreState(form.store);

    const element = useRenderElement('form', componentProps, {
        ref,
        props: [toReactProps(form.getFormProps()), elementProps]
    });

    const contextValue: FormContextValue = React.useMemo(
        () => ({
            formRef: { current: { fields: form.fields as FormContextValue['formRef']['current']['fields'] } },
            validationMode,
            errors: errors ?? EMPTY_OBJECT,
            clearErrors: form.clearErrors,
            submitAttemptedRef: form.submitAttemptedRef,
            form: form as unknown as FormController
        }),
        [form, validationMode, errors]
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
    export type Props<FormValues extends Record<string, any> = Record<string, any>> = FormProps<FormValues>;
    export type State = FormState;
    export type ValidationMode = FormValidationMode;
    export type SubmitEventReason = FormSubmitEventReason;
    export type SubmitEventDetails = FormSubmitEventDetails;

    export type Values<FormValues extends Record<string, any> = Record<string, any>> = FormValues;
}
