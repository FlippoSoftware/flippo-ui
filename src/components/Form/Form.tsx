'use client';

import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { FormContext } from './FormContext';

import type { TFormContext } from './FormContext';

const EMPTY = {};

/**
 * A native form element with consolidated error handling.
 * Renders a `<form>` element.
 *
 * Documentation: [Base UI Form](https://base-ui.com/react/components/form)
 */
export function Form(componentProps: Form.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        errors,
        onClearErrors: onClearErrorsProp,
        onSubmit: onSubmitProp,
        ref,
        ...elementProps
    } = componentProps;

    const formRef = React.useRef<TFormContext['formRef']['current']>({
        fields: new Map()
    });
    const submittedRef = React.useRef(false);

    const onSubmit = useEventCallback(onSubmitProp);
    const onClearErrors = useEventCallback(onClearErrorsProp);

    const focusControl = useEventCallback((control: HTMLElement) => {
        control.focus();
        if (control.tagName === 'INPUT') {
            (control as HTMLInputElement).select();
        }
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
            focusControl(invalidFields[0]!.controlRef.current);
        }
    }, [errors, focusControl]);

    const element = useRenderElement('form', componentProps, {
        state: EMPTY,
        ref,
        props: [{
            noValidate: true,
            onSubmit(event) {
                let values = Array.from(formRef.current.fields.values());

                // Async validation isn't supported to stop the submit event.
                values.forEach((field) => {
                    field.validate();
                });

                values = Array.from(formRef.current.fields.values());

                const invalidFields = values.filter((field) => !field.validityData.state.valid);

                if (invalidFields.length) {
                    event.preventDefault();
                    focusControl(invalidFields[0]!.controlRef.current);
                }
                else {
                    submittedRef.current = true;
                    onSubmit(event as any);
                }
            }
        }, elementProps]
    });

    const clearErrors = useEventCallback((name: string | undefined) => {
        if (name && errors && EMPTY.hasOwnProperty.call(errors, name)) {
            const nextErrors = { ...errors };
            delete nextErrors[name];
            onClearErrors(nextErrors);
        }
    });

    const contextValue: TFormContext = React.useMemo(
        () => ({
            formRef,
            errors: errors ?? {},
            clearErrors
        }),
        [formRef, errors, clearErrors]
    );

    return <FormContext value={contextValue}>{element}</FormContext>;
}

export namespace Form {
    export type State = object;

    export type Props = {
        /**
         * An object where the keys correspond to the `name` attribute of the form fields,
         * and the values correspond to the error(s) related to that field.
         */
        errors?: TFormContext['errors'];
        /**
         * Event handler called when the `errors` object is cleared.
         */
        onClearErrors?: (errors: TFormContext['errors']) => void;
    } & HeadlessUIComponentProps<'form', State>;
}
