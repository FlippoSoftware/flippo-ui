import React from 'react';

import { useControlledState } from '@flippo-ui/hooks/use-controlled-state';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { areArraysEqual } from '~@lib/areArraysEqual';
import { EMPTY_ARRAY } from '~@lib/constants';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { PARENT_CHECKBOX } from '../Checkbox/root/CheckboxRoot';
import { useFieldRootContext } from '../Field/root/FieldRootContext';
import { useField } from '../Field/useField';
import { fieldValidityMapping } from '../Field/utils/constants';
import { useFormContext } from '../Form/FormContext';
import { useLabelableContext } from '../LabelableProvider';

import type { FieldRoot } from '../Field/root/FieldRoot';

import { CheckboxGroupContext } from './CheckboxGroupContext';
import { useCheckboxGroupParent } from './useCheckboxGroupParent';

import type { CheckboxGroupContextValue } from './CheckboxGroupContext';

/**
 * Provides a shared state to a series of checkboxes.
 *
 * Documentation: [Base UI Checkbox Group](https://base-ui.com/react/components/checkbox-group)
 */
export function CheckboxGroup(componentProps: CheckboxGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        allValues,
        defaultValue,
        disabled: disabledProp = false,
        id: idProp,
        onValueChange,
        value: externalValue,
        ref,
        ...elementProps
    } = componentProps;

    const {
        disabled: fieldDisabled,
        name: fieldName,
        state: fieldState,
        validation,
        setFilled,
        setDirty,
        shouldValidateOnChange,
        validityData
    } = useFieldRootContext();
    const { labelId, getDescriptionProps } = useLabelableContext();
    const { clearErrors } = useFormContext();

    const disabled = fieldDisabled || disabledProp;

    const [value, setValueUnwrapped] = useControlledState({
        prop: externalValue,
        defaultProp: defaultValue,
        caller: 'CheckboxGroup'
    });

    const setValue = useStableCallback(
        (v: string[], eventDetails: CheckboxGroup.ChangeEventDetails) => {
            onValueChange?.(v, eventDetails);

            if (eventDetails.isCanceled) {
                return;
            }

            setValueUnwrapped(v);
        }
    );

    const parent = useCheckboxGroupParent({
        allValues,
        value: externalValue,
        onValueChange
    });

    const id = useHeadlessUiId(idProp);

    const controlRef = React.useRef<HTMLButtonElement>(null);

    const registerControlRef = React.useCallback((element: HTMLButtonElement | null) => {
        if (controlRef.current == null && element != null && !element.hasAttribute(PARENT_CHECKBOX)) {
            controlRef.current = element;
        }
    }, []);

    useField({
        enabled: !!fieldName,
        id,
        commit: validation.commit,
        value,
        controlRef,
        name: fieldName,
        getValue: () => value
    });

    const resolvedValue = value ?? EMPTY_ARRAY;

    useValueChanged(resolvedValue, () => {
        if (fieldName) {
            clearErrors(fieldName);
        }

        const initialValue = Array.isArray(validityData.initialValue)
            ? (validityData.initialValue as readonly string[])
            : EMPTY_ARRAY;

        setFilled(resolvedValue.length > 0);
        setDirty(!areArraysEqual(resolvedValue, initialValue));

        if (shouldValidateOnChange()) {
            validation.commit(resolvedValue);
        }
        else {
            validation.commit(resolvedValue, true);
        }
    });

    const state: CheckboxGroup.State = React.useMemo(
        () => ({
            ...fieldState,
            disabled
        }),
        [fieldState, disabled]
    );

    const contextValue: CheckboxGroupContextValue = React.useMemo(
        () => ({
            allValues,
            value,
            defaultValue,
            setValue,
            parent,
            disabled,
            validation,
            registerControlRef
        }),
        [
            allValues,
            value,
            defaultValue,
            setValue,
            parent,
            disabled,
            validation,
            registerControlRef
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            'role': 'group',
            'aria-labelledby': labelId
        }, getDescriptionProps, elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return (
        <CheckboxGroupContext.Provider value={contextValue}>{element}</CheckboxGroupContext.Provider>
    );
}

export type CheckboxGroupState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
} & FieldRoot.State;

export type CheckboxGroupProps = {
    /**
     * Names of the checkboxes in the group that should be ticked.
     *
     * To render an uncontrolled checkbox group, use the `defaultValue` prop instead.
     */
    value?: string[];
    /**
     * Names of the checkboxes in the group that should be initially ticked.
     *
     * To render a controlled checkbox group, use the `value` prop instead.
     */
    defaultValue?: string[];
    /**
     * Event handler called when a checkbox in the group is ticked or unticked.
     * Provides the new value as an argument.
     */
    onValueChange?: (value: string[], eventDetails: CheckboxGroupChangeEventDetails) => void;
    /**
     * Names of all checkboxes in the group. Use this when creating a parent checkbox.
     */
    allValues?: string[];
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & HeadlessUIComponentProps<'div', CheckboxGroup.State>;

export type CheckboxGroupChangeEventReason = typeof REASONS.none;
export type CheckboxGroupChangeEventDetails
    = HeadlessUIChangeEventDetails<CheckboxGroup.ChangeEventReason>;

export namespace CheckboxGroup {
    export type State = CheckboxGroupState;
    export type Props = CheckboxGroupProps;
    export type ChangeEventReason = CheckboxGroupChangeEventReason;
    export type ChangeEventDetails = CheckboxGroupChangeEventDetails;
}
