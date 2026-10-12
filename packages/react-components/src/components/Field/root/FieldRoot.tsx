import React from 'react';
import * as ReactDOM from 'react-dom';

import { FieldRootMachine } from '@flippo-software/core-components/field';
import { useStableCallback } from '@flippo-software/hooks/use-stable-callback';

import { useMachine, useStoreState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldsetRootContext } from '../../Fieldset/root/FieldsetRootContext';
import { useFormContext } from '../../Form/FormContext';
import { LabelableProvider, useLabelableContext } from '../../LabelableProvider';
import { fieldValidityMapping } from '../utils/constants';

import type { Form } from '../../Form';

import { FieldRootContext } from './FieldRootContext';

import type { FieldRootContextValue } from './FieldRootContext';

/**
 * Groups all parts of the field.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
function FieldRootInner(componentProps: FieldRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        validate: validateProp,
        validationDebounceTime = 0,
        validationMode,
        name,
        disabled = false,
        invalid,
        dirty,
        touched,
        ref,
        ...elementProps
    } = componentProps;

    const { form } = useFormContext();
    const { fieldset } = useFieldsetRootContext();
    const { labelable } = useLabelableContext();

    const validate = useStableCallback((value: unknown, formValues: Form.Values) => validateProp?.(value, formValues) ?? null);

    const field = useMachine((options) => new FieldRootMachine(options), {
        validate,
        validationDebounceTime,
        validationMode,
        name,
        disabled,
        invalid,
        dirty,
        touched,
        form,
        fieldset,
        labelable,
        flushSync: ReactDOM.flushSync
    });
    const internalState = useStoreState(field.store);
    const track = useTracker();

    const fieldState = track(() => field.getState());
    // biome-ignore lint/correctness/useExhaustiveDependencies: the state's fields are the dependencies.
    const state: FieldRoot.State = React.useMemo(
        () => fieldState,
        [fieldState.disabled, fieldState.touched, fieldState.dirty, fieldState.valid, fieldState.filled, fieldState.focused]
    );

    // Stable setters (effects of the parts depend on them); they accept updater functions like `setState`.
    const [setters] = React.useState(() => {
        const resolve = <T,>(update: React.SetStateAction<T>, current: T) =>
            typeof update === 'function' ? (update as (previous: T) => T)(current) : update;
        return {
            setTouched: ((update) => field.setTouched(resolve(update, field.getState().touched))) as React.Dispatch<
                React.SetStateAction<boolean>
            >,
            setDirty: ((update) => field.setDirty(resolve(update, field.getState().dirty))) as React.Dispatch<
                React.SetStateAction<boolean>
            >,
            setFilled: ((update) => field.setFilled(resolve(update, field.store.state.filled))) as React.Dispatch<
                React.SetStateAction<boolean>
            >,
            setFocused: ((update) => field.setFocused(resolve(update, field.store.state.focused))) as React.Dispatch<
                React.SetStateAction<boolean>
            >,
            validation: {
                getValidationProps: field.getValidationProps,
                getInputValidationProps: field.getInputValidationProps,
                inputRef: field.inputRef,
                commit: field.commit
            } as FieldRootContextValue['validation']
        };
    });

    const fieldInvalid = field.invalid;
    const contextValue: FieldRootContextValue = React.useMemo(
        () => ({
            invalid: fieldInvalid,
            name,
            validityData: internalState.validityData,
            setValidityData: field.setValidityData as FieldRootContextValue['setValidityData'],
            disabled: state.disabled,
            touched: state.touched,
            setTouched: setters.setTouched,
            dirty: state.dirty,
            setDirty: setters.setDirty,
            filled: state.filled,
            setFilled: setters.setFilled,
            focused: state.focused,
            setFocused: setters.setFocused,
            validate,
            validationMode: field.validationMode,
            validationDebounceTime,
            shouldValidateOnChange: field.shouldValidateOnChange,
            state,
            markedDirtyRef: field.markedDirtyRef as React.RefObject<boolean>,
            validation: setters.validation,
            field
        }),
        [fieldInvalid, name, internalState.validityData, field, state, setters, validate, validationDebounceTime]
    );

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: elementProps,
        customStyleHookMapping: fieldValidityMapping
    });

    return <FieldRootContext.Provider value={contextValue}>{element}</FieldRootContext.Provider>;
}

/**
 * Groups all parts of the field.
 * Renders a `<div>` element.
 */
export function FieldRoot(componentProps: FieldRoot.Props) {
    return (
        <LabelableProvider>
            <FieldRootInner {...componentProps} />
        </LabelableProvider>
    );
}

export type FieldValidityData = {
    state: {
        badInput: boolean;
        customError: boolean;
        patternMismatch: boolean;
        rangeOverflow: boolean;
        rangeUnderflow: boolean;
        stepMismatch: boolean;
        tooLong: boolean;
        tooShort: boolean;
        typeMismatch: boolean;
        valueMissing: boolean;
        valid: boolean | null;
    };
    error: string;
    errors: string[];
    value: unknown;
    initialValue: unknown;
};

export type FieldRootState = {
    /** Whether the component should ignore user interaction. */
    disabled: boolean;
    touched: boolean;
    dirty: boolean;
    valid: boolean | null;
    filled: boolean;
    focused: boolean;
};

export type FieldRootProps = {
    /**
     * Whether the component should ignore user interaction.
     * Takes precedence over the `disabled` prop on the `<Field.Control>` component.
     * @default false
     */
    disabled?: boolean;
    /**
     * Identifies the field when a form is submitted.
     * Takes precedence over the `name` prop on the `<Field.Control>` component.
     */
    name?: string;
    /**
     * A function for custom validation. Return a string or an array of strings with
     * the error message(s) if the value is invalid, or `null` if the value is valid.
     * Asynchronous functions are supported, but they do not prevent form submission
     * when using `validationMode="onSubmit"`.
     */
    validate?: (value: unknown, formValues: Form.Values) => string | string[] | null | Promise<string | string[] | null>;
    /**
     * Determines when the field should be validated.
     * This takes precedence over the `validationMode` prop on `<Form>`.
     *
     * - `onSubmit`: triggers validation when the form is submitted, and re-validates on change after submission.
     * - `onBlur`: triggers validation when the control loses focus.
     * - `onChange`: triggers validation on every change to the control value.
     *
     * @default 'onSubmit'
     */
    validationMode?: Form.ValidationMode;
    /**
     * How long to wait between `validate` callbacks if
     * `validationMode="onChange"` is used. Specified in milliseconds.
     * @default 0
     */
    validationDebounceTime?: number;
    /**
     * Whether the field is invalid.
     * Useful when the field state is controlled by an external library.
     */
    invalid?: boolean;
    /**
     * Whether the field's value has been changed from its initial value.
     * Useful when the field state is controlled by an external library.
     */
    dirty?: boolean;
    /**
     * Whether the field has been touched.
     * Useful when the field state is controlled by an external library.
     */
    touched?: boolean;
} & HeadlessUIComponentProps<'div', FieldRoot.State>;

export namespace FieldRoot {
    export type State = FieldRootState;
    export type Props = FieldRootProps;
}
