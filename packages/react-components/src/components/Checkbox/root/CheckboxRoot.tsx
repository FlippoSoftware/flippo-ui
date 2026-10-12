import React from 'react';

import { CheckboxMachine } from '@flippo-software/core-components/checkbox';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import type { CheckboxOptions } from '@flippo-software/core-components/checkbox';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useCheckboxGroupContext } from '../../CheckboxGroup/CheckboxGroupContext';
import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';
import { useStateAttributesMapping } from '../utils/useStateAttributesMapping';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { CheckboxRootContext } from './CheckboxRootContext';

export const PARENT_CHECKBOX = 'data-parent';

/**
 * Represents the checkbox itself.
 * Renders a `<span>` element and a hidden `<input>` beside.
 */
export function CheckboxRoot(componentProps: CheckboxRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        checked,
        defaultChecked = false,
        disabled = false,
        id,
        indeterminate = false,
        inputRef: inputRefProp,
        name,
        onCheckedChange,
        parent = false,
        readOnly = false,
        required = false,
        value,
        nativeButton = false,
        ...elementProps
    } = componentProps;

    const { field } = useFieldRootContext();
    const fieldItemContext = useFieldItemContext();
    const { labelable } = useLabelableContext();
    const groupContext = useCheckboxGroupContext();

    const defaultId = useHeadlessUiId() as string;

    const checkbox = useMachine((options) => new CheckboxMachine(options), {
        id,
        checked,
        defaultChecked,
        disabled,
        indeterminate,
        name,
        onCheckedChange: onCheckedChange as CheckboxOptions['onCheckedChange'],
        parent,
        readOnly,
        required,
        value,
        nativeButton,
        field,
        fieldItemDisabled: fieldItemContext.disabled,
        labelable,
        group: groupContext?.group,
        defaultId
    });
    const state: CheckboxRoot.State = useMachineState(checkbox);
    const track = useTracker();

    const inputId = checkbox.inputId;
    // The checkbox owns the control id of its label.
    useIsoLayoutEffect(() => checkbox.registerId(), [checkbox, inputId]);

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => checkbox.registerField());

    useIsoLayoutEffect(() => {
        checkbox.syncInput();
    }, [checkbox, state.checked, state.indeterminate]);

    const stateAttributesMapping = useStateAttributesMapping(state);

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [checkbox.setControlElement, ref],
        props: [elementProps, (props) => track(() => toReactProps(checkbox.getRootProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    const uncheckedInputProps = track(() => checkbox.getUncheckedInputProps());
    const inputRef = React.useCallback(
        (element: HTMLInputElement | null) => {
            checkbox.setInputElement(element);
            if (typeof inputRefProp === 'function') {
                inputRefProp(element);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = element;
            }
        },
        [checkbox, inputRefProp]
    );

    return (
        <CheckboxRootContext.Provider value={state}>
            {element}
            {uncheckedInputProps && <input {...toReactProps(uncheckedInputProps)} />}
            <input {...track(() => toReactProps(checkbox.getInputProps()))} ref={inputRef} />
        </CheckboxRootContext.Provider>
    );
}

export type CheckboxRootState = {
    /**
     * Whether the checkbox is currently ticked.
     */
    checked: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the user should be unable to tick or untick the checkbox.
     */
    readOnly: boolean;
    /**
     * Whether the user must tick the checkbox before submitting a form.
     */
    required: boolean;
    /**
     * Whether the checkbox is in a mixed state: neither ticked, nor unticked.
     */
    indeterminate: boolean;
} & FieldRoot.State;

export type CheckboxRootProps = {
    /**
     * The id of the input element.
     */
    id?: string;
    /**
     * Identifies the field when a form is submitted.
     * @default undefined
     */
    name?: string;
    /**
     * Whether the checkbox is currently ticked.
     *
     * To render an uncontrolled checkbox, use the `defaultChecked` prop instead.
     * @default undefined
     */
    checked?: boolean;
    /**
     * Whether the checkbox is initially ticked.
     *
     * To render a controlled checkbox, use the `checked` prop instead.
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Event handler called when the checkbox is ticked or unticked.
     */
    onCheckedChange?: (checked: boolean, eventDetails: CheckboxRootChangeEventDetails) => void;
    /**
     * Whether the user should be unable to tick or untick the checkbox.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the user must tick the checkbox before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * Whether the checkbox is in a mixed state: neither ticked, nor unticked.
     * @default false
     */
    indeterminate?: boolean;
    /**
     * A ref to access the hidden `<input>` element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * Whether the checkbox controls a group of child checkboxes.
     *
     * Must be used in a [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
     * @default false
     */
    parent?: boolean;
    /**
     * The value of the selected checkbox.
     */
    value?: string;
} & NonNativeButtonProps &
    Omit<HeadlessUIComponentProps<'span', CheckboxRoot.State>, 'onChange' | 'value'>;

export type CheckboxRootChangeEventReason = typeof REASONS.none;
export type CheckboxRootChangeEventDetails = HeadlessUIChangeEventDetails<CheckboxRoot.ChangeEventReason>;

export namespace CheckboxRoot {
    export type State = CheckboxRootState;
    export type Props = CheckboxRootProps;
    export type ChangeEventReason = CheckboxRootChangeEventReason;
    export type ChangeEventDetails = CheckboxRootChangeEventDetails;
}
