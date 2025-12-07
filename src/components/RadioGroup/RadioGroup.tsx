import React from 'react';

import {
    useControlledState,
    useMergedRef
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { useHeadlessUiId } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { NOOP } from '~@lib/noop';
import { visuallyHidden } from '~@lib/visuallyHidden';
import { contains } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { SHIFT } from '../Composite/composite';
import { CompositeRoot } from '../Composite/root/CompositeRoot';
import { useFieldRootContext } from '../Field/root/FieldRootContext';
import { useField } from '../Field/useField';
import { fieldValidityMapping } from '../Field/utils/constants';
import { useFieldsetRootContext } from '../Fieldset/root/FieldsetRootContext';
import { useFormContext } from '../Form/FormContext';
import { useLabelableContext } from '../LabelableProvider';

import type { FieldRoot } from '../Field/root/FieldRoot';

import { RadioGroupContext } from './RadioGroupContext';

import type { RadioGroupContextValue } from './RadioGroupContext';

/**
 * Provides a shared state to a series of radio buttons.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Radio Group](https://base-ui.com/react/components/radio)
 */
const MODIFIER_KEYS = [SHIFT];

/**
 * Provides a shared state to a series of radio buttons.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Radio Group](https://base-ui.com/react/components/radio)
 */
export function RadioGroup(componentProps: RadioGroupProps) {
    const {
        render,
        className,
        disabled: disabledProp,
        readOnly,
        required,
        onValueChange: onValueChangeProp,
        value: externalValue,
        defaultValue,
        name: nameProp,
        inputRef: inputRefProp,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const {
        setTouched: setFieldTouched,
        setFocused,
        shouldValidateOnChange,
        validationMode,
        name: fieldName,
        disabled: fieldDisabled,
        state: fieldState,
        validation,
        setDirty,
        setFilled,
        validityData
    } = useFieldRootContext();
    const { labelId } = useLabelableContext();
    const { clearErrors } = useFormContext();
    const fieldsetContext = useFieldsetRootContext(true);

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;
    const id = useHeadlessUiId(idProp);

    const [checkedValue, setCheckedValueUnwrapped] = useControlledState({
        prop: externalValue,
        defaultProp: defaultValue,
        caller: 'RadioGroup'
    });

    const onValueChange = useStableCallback(onValueChangeProp);

    const setCheckedValue = useStableCallback(
        (value: unknown, eventDetails: RadioGroup.ChangeEventDetails) => {
            onValueChange(value, eventDetails);

            if (eventDetails.isCanceled) {
                return;
            }

            setCheckedValueUnwrapped(value);
        }
    );

    const controlRef = React.useRef<HTMLElement>(null);
    const registerControlRef = useStableCallback((element: HTMLElement | null) => {
        if (controlRef.current == null && element != null) {
            controlRef.current = element;
        }
    });

    useField({
        id,
        commit: validation.commit,
        value: checkedValue,
        controlRef,
        name,
        getValue: () => checkedValue ?? null
    });

    useValueChanged(checkedValue, () => {
        clearErrors(name);

        setDirty(checkedValue !== validityData.initialValue);
        setFilled(checkedValue != null);

        if (shouldValidateOnChange()) {
            validation.commit(checkedValue);
        }
        else {
            validation.commit(checkedValue, true);
        }
    });

    const [touched, setTouched] = React.useState(false);

    const onBlur = useStableCallback((event) => {
        if (!contains(event.currentTarget, event.relatedTarget)) {
            setFieldTouched(true);
            setFocused(false);

            if (validationMode === 'onBlur') {
                validation.commit(checkedValue);
            }
        }
    });

    const onKeyDownCapture = useStableCallback((event) => {
        if (event.key.startsWith('Arrow')) {
            setFieldTouched(true);
            setTouched(true);
            setFocused(true);
        }
    });

    const serializedCheckedValue = React.useMemo(() => {
        if (checkedValue == null) {
            return ''; // avoid uncontrolled -> controlled error
        }
        if (typeof checkedValue === 'string') {
            return checkedValue;
        }
        return JSON.stringify(checkedValue);
    }, [checkedValue]);

    const mergedInputRef = useMergedRef(validation.inputRef, inputRefProp);

    const inputProps = mergeProps<'input'>(
        {
            'value': serializedCheckedValue,
            'ref': mergedInputRef,
            id,
            'name': serializedCheckedValue ? name : undefined,
            disabled,
            readOnly,
            required,
            'aria-labelledby': elementProps['aria-labelledby'] ?? fieldsetContext?.legendId,
            'aria-hidden': true,
            'tabIndex': -1,
            'style': visuallyHidden,
            'onChange': NOOP, // suppress a Next.js error
            onFocus() {
                controlRef.current?.focus();
            }
        },
        validation.getInputValidationProps
    );

    const state: RadioGroup.State = React.useMemo(
        () => ({
            ...fieldState,
            disabled: disabled ?? false,
            required: required ?? false,
            readOnly: readOnly ?? false
        }),
        [fieldState, disabled, readOnly, required]
    );

    const contextValue: RadioGroupContextValue = React.useMemo(
        () => ({
            ...fieldState,
            checkedValue,
            disabled,
            validation,
            name,
            onValueChange,
            readOnly,
            registerControlRef,
            required,
            setCheckedValue,
            setTouched,
            touched
        }),
        [
            checkedValue,
            disabled,
            validation,
            fieldState,
            name,
            onValueChange,
            readOnly,
            registerControlRef,
            required,
            setCheckedValue,
            setTouched,
            touched
        ]
    );

    const defaultProps: HTMLProps = {
        'role': 'radiogroup',
        'aria-required': required || undefined,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-labelledby': labelId,
        onFocus() {
            setFocused(true);
        },
        onBlur,
        onKeyDownCapture
    };

    return (
        <RadioGroupContext.Provider value={contextValue}>
            <CompositeRoot
                render={render}
                className={className}
                state={state}
                props={[defaultProps, validation.getValidationProps, elementProps]}
                refs={[ref]}
                stateAttributesMapping={fieldValidityMapping}
                enableHomeAndEndKeys={false}
                modifierKeys={MODIFIER_KEYS}
            />
            <input {...inputProps} />
        </RadioGroupContext.Provider>
    );
}

export type RadioGroupState = {
    /**
     * Whether the user should be unable to select a different radio button in the group.
     */
    readOnly: boolean | undefined;
} & FieldRoot.State;

export type RadioGroupProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the user should be unable to select a different radio button in the group.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the user must choose a value before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * Identifies the field when a form is submitted.
     */
    name?: string;
    /**
     * The controlled value of the radio item that should be currently selected.
     *
     * To render an uncontrolled radio group, use the `defaultValue` prop instead.
     */
    value?: unknown;
    /**
     * The uncontrolled value of the radio button that should be initially selected.
     *
     * To render a controlled radio group, use the `value` prop instead.
     */
    defaultValue?: unknown;
    /**
     * Callback fired when the value changes.
     */
    onValueChange?: (value: unknown, eventDetails: RadioGroup.ChangeEventDetails) => void;
    /**
     * A ref to access the hidden input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
} & Omit<HeadlessUIComponentProps<'div', RadioGroup.State>, 'value'>;

export type RadioGroupChangeEventReason = typeof REASONS.none;

export type RadioGroupChangeEventDetails = HeadlessUIChangeEventDetails<RadioGroup.ChangeEventReason>;

export namespace RadioGroup {
    export type State = RadioGroupState;
    export type Props = RadioGroupProps;
    export type ChangeEventReason = RadioGroupChangeEventReason;
    export type ChangeEventDetails = RadioGroupChangeEventDetails;
}
