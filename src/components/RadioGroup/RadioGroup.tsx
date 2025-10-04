'use client';

import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo-ui/hooks';

import { useHeadlessUiId } from '@lib/hooks';
import { mergeProps } from '@lib/merge';
import { visuallyHidden } from '@lib/visuallyHidden';
import { contains } from '@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { SHIFT } from '../Composite/composite';
import { CompositeRoot } from '../Composite/root/CompositeRoot';
import { useFieldControlValidation } from '../Field/control/useFieldControlValidation';
import { useFieldRootContext } from '../Field/root/FieldRootContext';
import { useField } from '../Field/useField';
import { fieldValidityMapping } from '../Field/utils/constants';
import { useFormContext } from '../Form/FormContext';

import type { FieldRoot } from '../Field/root/FieldRoot';

import { RadioGroupContext } from './RadioGroupContext';

import type { TRadioGroupContext } from './RadioGroupContext';

const MODIFIER_KEYS = [SHIFT];

/**
 * Provides a shared state to a series of radio buttons.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Radio Group](https://base-ui.com/react/components/radio)
 */
export function RadioGroup(componentProps: RadioGroup.Props) {
    const {
        className,
        render,
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
        labelId,
        setTouched: setFieldTouched,
        setFocused,
        validationMode,
        name: fieldName,
        disabled: fieldDisabled,
        state: fieldState
    } = useFieldRootContext();
    const fieldControlValidation = useFieldControlValidation();
    const { clearErrors } = useFormContext();

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;
    const id = useHeadlessUiId(idProp);

    const [checkedValue, setCheckedValue] = useControlledState({
        prop: externalValue,
        defaultProp: defaultValue,
        caller: 'RadioGroup'
    });

    const controlRef = React.useRef<HTMLElement>(null);
    const registerControlRef = useEventCallback((element: HTMLElement | null) => {
        if (controlRef.current == null && element != null) {
            controlRef.current = element;
        }
    });

    useField({
        id,
        commitValidation: fieldControlValidation.commitValidation,
        value: checkedValue,
        controlRef,
        name,
        getValue: () => checkedValue ?? null
    });

    const prevValueRef = React.useRef(checkedValue);

    useIsoLayoutEffect(() => {
        if (prevValueRef.current === checkedValue) {
            return;
        }

        clearErrors(name);

        if (validationMode === 'onChange') {
            fieldControlValidation.commitValidation(checkedValue);
        }
        else {
            fieldControlValidation.commitValidation(checkedValue, true);
        }
    }, [
        name,
        clearErrors,
        validationMode,
        checkedValue,
        fieldControlValidation
    ]);

    useIsoLayoutEffect(() => {
        prevValueRef.current = checkedValue;
    }, [checkedValue]);

    const [touched, setTouched] = React.useState(false);

    const onBlur = useEventCallback((event) => {
        if (!contains(event.currentTarget, event.relatedTarget)) {
            setFieldTouched(true);
            setFocused(false);

            if (validationMode === 'onBlur') {
                fieldControlValidation.commitValidation(checkedValue);
            }
        }
    });

    const onKeyDownCapture = useEventCallback((event) => {
        if (event.key.startsWith('Arrow')) {
            setFieldTouched(true);
            setTouched(true);
            setFocused(true);
        }
    });

    const onValueChange = useEventCallback(onValueChangeProp);

    const serializedCheckedValue = React.useMemo(() => {
        if (checkedValue == null) {
            return ''; // avoid uncontrolled -> controlled error
        }
        if (typeof checkedValue === 'string') {
            return checkedValue;
        }
        return JSON.stringify(checkedValue);
    }, [checkedValue]);

    const mergedInputRef = useMergedRef(fieldControlValidation.inputRef, inputRefProp);

    const inputProps = mergeProps<'input'>(
        {
            'value': serializedCheckedValue,
            'ref': mergedInputRef,
            id,
            'name': serializedCheckedValue ? name : undefined,
            disabled,
            readOnly,
            required,
            'aria-hidden': true,
            'tabIndex': -1,
            'style': visuallyHidden,
            onFocus() {
                controlRef.current?.focus();
            }
        },
        fieldControlValidation.getInputValidationProps
    );

    const state: RadioGroup.State = React.useMemo(
        () => ({
            ...fieldState,
            disabled: disabled ?? false,
            required: required ?? false,
            readOnly: readOnly ?? false
        }),
        [
            fieldState,
            disabled,
            readOnly,
            required
        ]
    );

    const contextValue: TRadioGroupContext = React.useMemo(
        () => ({
            ...fieldState,
            checkedValue,
            disabled,
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
        <RadioGroupContext value={contextValue}>
            <CompositeRoot
                render={render}
                className={className}
                state={state}
                props={[defaultProps, fieldControlValidation.getValidationProps, elementProps]}
                refs={[ref]}
                customStyleHookMapping={fieldValidityMapping}
                enableHomeAndEndKeys={false}
                modifierKeys={MODIFIER_KEYS}
                stopEventPropagation
            />
            <input {...inputProps} />
        </RadioGroupContext>
    );
}

export namespace RadioGroup {
    export type State = {
        /**
         * Whether the user should be unable to select a different radio button in the group.
         */
        readOnly: boolean | undefined;
    } & FieldRoot.State;

    export type Props = {
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
        onValueChange?: (value: unknown, event: Event) => void;
        /**
         * A ref to access the hidden input element.
         */
        inputRef?: React.Ref<HTMLInputElement>;
    } & Omit<HeadlessUIComponentProps<'div', State>, 'value'>;
}
