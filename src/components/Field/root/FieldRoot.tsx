import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldsetRootContext } from '../../Fieldset/root/FieldsetRootContext';
import { useFormContext } from '../../Form/FormContext';
import { LabelableProvider } from '../../LabelableProvider';
import { DEFAULT_VALIDITY_STATE, fieldValidityMapping } from '../utils/constants';

import type { Form } from '../../Form';

import { FieldRootContext } from './FieldRootContext';
import { useFieldValidation } from './useFieldValidation';

import type { FieldRootContextValue } from './FieldRootContext';

/**
 * Groups all parts of the field.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
function FieldRootInner(componentProps: FieldRoot.Props) {
    const { errors, validationMode: formValidationMode, submitAttemptedRef } = useFormContext();

    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        validate: validateProp,
        validationDebounceTime = 0,
        validationMode = formValidationMode,
        name,
        disabled: disabledProp = false,
        invalid: invalidProp,
        dirty: dirtyProp,
        touched: touchedProp,
        ref,
        ...elementProps
    } = componentProps;

    const { disabled: disabledFieldset } = useFieldsetRootContext();

    const validate = useEventCallback(validateProp || (() => null));

    const disabled = disabledFieldset || disabledProp;

    const [touchedState, setTouchedUnwrapped] = React.useState(false);
    const [dirtyState, setDirtyUnwrapped] = React.useState(false);
    const [filled, setFilled] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const dirty = dirtyProp ?? dirtyState;
    const touched = touchedProp ?? touchedState;

    const markedDirtyRef = React.useRef(false);

    const setDirty: typeof setDirtyUnwrapped = useEventCallback((value) => {
        if (dirtyProp !== undefined) {
            return;
        }

        if (value) {
            markedDirtyRef.current = true;
        }
        setDirtyUnwrapped(value);
    });

    const setTouched: typeof setTouchedUnwrapped = useEventCallback((value) => {
        if (touchedProp !== undefined) {
            return;
        }
        setTouchedUnwrapped(value);
    });

    const shouldValidateOnChange = useEventCallback(
        () =>
            validationMode === 'onChange'
            || (validationMode === 'onSubmit' && submitAttemptedRef.current)
    );

    const invalid = Boolean(
        invalidProp || (name && {}.hasOwnProperty.call(errors, name) && errors[name] !== undefined)
    );

    const [validityData, setValidityData] = React.useState<FieldValidityData>({
        state: DEFAULT_VALIDITY_STATE,
        error: '',
        errors: [],
        value: null,
        initialValue: null
    });

    const valid = !invalid && validityData.state.valid;

    const state: FieldRoot.State = React.useMemo(
        () => ({
            disabled,
            touched,
            dirty,
            valid,
            filled,
            focused
        }),
        [
            disabled,
            touched,
            dirty,
            valid,
            filled,
            focused
        ]
    );

    const validation = useFieldValidation({
        setValidityData,
        validate,
        validityData,
        validationDebounceTime,
        invalid,
        markedDirtyRef,
        state,
        name,
        shouldValidateOnChange
    });

    const contextValue: FieldRootContextValue = React.useMemo(
        () => ({
            invalid,
            name,
            validityData,
            setValidityData,
            disabled,
            touched,
            setTouched,
            dirty,
            setDirty,
            filled,
            setFilled,
            focused,
            setFocused,
            validate,
            validationMode,
            validationDebounceTime,
            shouldValidateOnChange,
            state,
            markedDirtyRef,
            validation
        }),
        [
            invalid,
            name,
            validityData,
            disabled,
            touched,
            setTouched,
            dirty,
            setDirty,
            filled,
            setFilled,
            focused,
            setFocused,
            validate,
            validationMode,
            validationDebounceTime,
            shouldValidateOnChange,
            state,
            validation
        ]
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
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
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
    validate?: (
        value: unknown,
        formValues: Form.Values,
    ) => string | string[] | null | Promise<string | string[] | null>;
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
