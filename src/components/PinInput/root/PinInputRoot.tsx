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

import { CompositeRoot } from '../../Composite';
import { SHIFT } from '../../Composite/composite';
import { useFieldControlValidation } from '../../Field/control/useFieldControlValidation';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { useFormContext } from '../../Form/FormContext';
import { pinInputStyleHookMapping } from '../utils/styleHooks';

import type { CompositeMetadata } from '../../Composite';
import type { Field } from '../../Field';

import { PinInputRootContext } from './PinInputRootContext';

import type { PinInputRootContextValue } from './PinInputRootContext';

const MODIFIER_KEYS = [SHIFT];

export function PinInputRoot(componentProps: PinInputRoot.Props) {
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
        placeholder = '○',
        inputRef: inputRefProp,
        id: idProp,
        ref,
        otp = false,
        mask = false,
        blurOnComplete = false,
        selectOnFocus = false,
        pattern,
        type = 'numeric',
        ...elementProps
    } = componentProps;

    const [completed, setCompleted] = React.useState(false);

    const {
        labelId,
        setTouched: setFieldTouched,
        validationMode,
        name: fieldName,
        disabled: fieldDisabled,
        state: fieldState,
        setDirty,
        setFilled,
        setFocused
    } = useFieldRootContext();
    const fieldControlValidation = useFieldControlValidation();
    const { clearErrors } = useFormContext();

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;
    const id = useHeadlessUiId(idProp);

    const [checkedValue, setCheckedValue] = useControlledState({
        prop: externalValue ?? '',
        defaultProp: defaultValue ?? '',
        caller: 'PinInput'
    });

    const [values, setValues] = React.useState(() => String(checkedValue).split(''));

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

    const onValueChange = React.useCallback((pinValue: string, index: number, event: Event) => {
        const newValues = [...values];
        newValues[index] = pinValue;

        const value = newValues.join('');

        setValues(newValues);
        setCheckedValue(value);
        onValueChangeProp?.(value, newValues, event);
    }, [onValueChangeProp, setCheckedValue, values]);

    const serializedCheckedValue = React.useMemo(() => {
        if (checkedValue == null) {
            return ''; // avoid uncontrolled -> controlled error
        }
        if (typeof checkedValue === 'string') {
            return checkedValue;
        }
        return JSON.stringify(checkedValue);
    }, [checkedValue]);

    const mergedInputRef = useMergedRef(fieldControlValidation.inputRef, controlRef, inputRefProp);

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

    const state: PinInputRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            completed,
            disabled: disabled ?? false,
            required: required ?? false,
            readOnly: readOnly ?? false
        }),
        [
            fieldState,
            completed,
            disabled,
            required,
            readOnly
        ]
    );

    const contextValue: PinInputRootContextValue = React.useMemo(
        () => ({
            state,
            mask,
            otp,
            checkedValue,
            name,
            touched,
            values,
            placeholder,
            controlRef,
            blurOnComplete,
            selectOnFocus,
            pattern,
            type,
            setFocused,
            setDirty,
            setFilled,
            setCompleted,
            setValues,
            setTouched,
            setCheckedValue,
            registerControlRef,
            onValueChange
        }),
        [
            blurOnComplete,
            checkedValue,
            mask,
            name,
            onValueChange,
            otp,
            pattern,
            placeholder,
            registerControlRef,
            selectOnFocus,
            setCheckedValue,
            setDirty,
            setFilled,
            setFocused,
            state,
            touched,
            type,
            values
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
        <PinInputRootContext value={contextValue}>
            <CompositeRoot
                render={render}
                className={className}
                state={state}
                props={[defaultProps, fieldControlValidation.getValidationProps, elementProps]}
                refs={[ref]}
              customStyleHookMapping={pinInputStyleHookMapping}
                enableHomeAndEndKeys={false}
                modifierKeys={MODIFIER_KEYS}
                stopEventPropagation
            />
            <input {...inputProps} />
        </PinInputRootContext>
    );
}

export namespace PinInputRoot {
    export type InputMetadata = CompositeMetadata<{
        value: string;
    }>;

    export type State = {
        completed: boolean;
        readOnly: boolean;
    } & Field.Root.State;

    export type Props = CompositeRoot.Props<InputMetadata, State> & {
        mask?: boolean;
        otp?: boolean;
        /**
         * The regular expression that the user-entered input value is checked against.
         */
        pattern?: string | undefined;
        /**
         * The placeholder text for the input
         * @default "○"
         */
        placeholder?: string | undefined;
        /**
         * Whether to auto-focus the first input.
         */
        autoFocus?: boolean | undefined;
        /**
         * The type of input to render
         */
        type?: 'alphanumeric' | 'numeric' | 'alphabetic' | undefined;
        /**
         * Whether to blur the input when the value is complete
         */
        blurOnComplete?: boolean | undefined;
        /**
         * Whether to select input value when input is focused
         */
        selectOnFocus?: boolean | undefined;
        onValueComplete: (value: string, values: string[], event: Event) => void;
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
        value?: string;
        /**
         * The uncontrolled value of the radio button that should be initially selected.
         *
         * To render a controlled radio group, use the `value` prop instead.
         */
        defaultValue?: string;
        /**
         * Callback fired when the value changes.
         */
        onValueChange?: (value: string, values: string[], event: Event) => void;

        /**
         * A ref to access the hidden input element.
         */
        inputRef?: React.Ref<HTMLInputElement>;
    } & Omit<HeadlessUIComponentProps<'div', State>, 'value'>;
}
