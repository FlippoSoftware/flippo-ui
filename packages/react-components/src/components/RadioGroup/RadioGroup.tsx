import React from 'react';

import { RadioGroupMachine } from '@flippo-software/core-components/radio-group';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import type { RadioGroupOptions } from '@flippo-software/core-components/radio-group';

import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeMachineProvider } from '../Composite/root/CompositeMachineProvider';
import { useFieldRootContext } from '../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../Field/utils/constants';
import { useFieldsetRootContext } from '../Fieldset/root/FieldsetRootContext';
import { useLabelableContext } from '../LabelableProvider';

import type { FieldRoot } from '../Field/root/FieldRoot';

import { RadioGroupContext } from './RadioGroupContext';

import type { RadioGroupContextValue } from './RadioGroupContext';

/**
 * Provides a shared state to a series of radio buttons.
 * Renders a `<div>` element.
 */
export function RadioGroup(componentProps: RadioGroupProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled,
        readOnly,
        required,
        onValueChange,
        value,
        defaultValue,
        name,
        inputRef: inputRefProp,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const { field, state: fieldState, validation } = useFieldRootContext();
    const { labelable } = useLabelableContext();
    const { fieldset } = useFieldsetRootContext();
    const direction = useDirection();

    const id = useHeadlessUiId(idProp) as string;

    const group = useMachine((options) => new RadioGroupMachine(options), {
        disabled,
        readOnly,
        required,
        name,
        value,
        defaultValue,
        onValueChange: onValueChange as RadioGroupOptions['onValueChange'],
        field,
        fieldset,
        labelable,
        id,
        direction
    });
    const { touched } = useStoreState(group.store);

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => group.registerField());

    const checkedValue = group.checkedValue;
    const groupDisabled = group.disabled;
    const groupReadOnly = group.readOnly;
    const groupRequired = group.required;

    const state: RadioGroup.State = React.useMemo(
        () => ({ ...fieldState, disabled: groupDisabled, required: groupRequired, readOnly: groupReadOnly }),
        [fieldState, groupDisabled, groupReadOnly, groupRequired]
    );

    // Stable (radios' effects depend on it); accepts updater functions like `setState`.
    const [setTouched] = React.useState(
        () =>
            ((update) =>
                group.setTouched(typeof update === 'function' ? update(group.touched) : update)) as RadioGroupContextValue['setTouched']
    );

    const contextValue: RadioGroupContextValue = React.useMemo(
        () => ({
            ...fieldState,
            checkedValue,
            disabled: groupDisabled,
            validation,
            name: group.name,
            onValueChange: group.setCheckedValue as RadioGroupContextValue['onValueChange'],
            readOnly: groupReadOnly,
            registerControlRef: group.registerControlRef,
            required: groupRequired,
            setCheckedValue: group.setCheckedValue as RadioGroupContextValue['setCheckedValue'],
            setTouched,
            touched,
            group
        }),
        [fieldState, checkedValue, groupDisabled, validation, group, groupReadOnly, groupRequired, setTouched, touched]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, group.composite.setRoot],
        props: [elementProps, (props) => toReactProps(group.getRootProps(props))],
        customStyleHookMapping: fieldValidityMapping
    });

    const inputRef = React.useCallback(
        (inputElement: HTMLInputElement | null) => {
            group.setInputElement(inputElement);
            if (typeof inputRefProp === 'function') {
                inputRefProp(inputElement);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = inputElement;
            }
        },
        [group, inputRefProp]
    );

    return (
        <RadioGroupContext.Provider value={contextValue}>
            <CompositeMachineProvider composite={group.composite}>{element}</CompositeMachineProvider>
            <input {...toReactProps(group.getInputProps(elementProps['aria-labelledby']))} ref={inputRef} />
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
