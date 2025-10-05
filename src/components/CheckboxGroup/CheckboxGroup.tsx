import React from 'react';

import { useControlledState, useEventCallback } from '@flippo-ui/hooks';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { PARENT_CHECKBOX } from '../Checkbox/root/CheckboxRoot';
import { useFieldControlValidation } from '../Field/control/useFieldControlValidation';
import { useFieldRootContext } from '../Field/root/FieldRootContext';
import { useField } from '../Field/useField';
import { fieldValidityMapping } from '../Field/utils/constants';

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
        labelId,
        name: fieldName,
        state: fieldState
    } = useFieldRootContext();

    const disabled = fieldDisabled || disabledProp;

    const fieldControlValidation = useFieldControlValidation();

    const [value, setValueUnwrapped] = useControlledState({
        prop: externalValue,
        defaultProp: defaultValue,
        caller: 'CheckboxGroup'
    });

    const setValue = useEventCallback(
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
    const registerControlRef = useEventCallback((element: HTMLButtonElement | null) => {
        if (controlRef.current == null && element != null && !element.hasAttribute(PARENT_CHECKBOX)) {
            controlRef.current = element;
        }
    });

    useField({
        enabled: !!fieldName,
        id,
        commitValidation: fieldControlValidation.commitValidation,
        value,
        controlRef,
        name: fieldName,
        getValue: () => value
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
            fieldControlValidation,
            registerControlRef
        }),
        [
            allValues,
            value,
            defaultValue,
            setValue,
            parent,
            disabled,
            fieldControlValidation,
            registerControlRef
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            'role': 'group',
            'aria-labelledby': labelId
        }, elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return (
        <CheckboxGroupContext.Provider value={contextValue}>{element}</CheckboxGroupContext.Provider>
    );
}

export namespace CheckboxGroup {
    export type State = {
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
    } & FieldRoot.State;

    export type Props = {
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
        onValueChange?: (value: string[], eventDetails: ChangeEventDetails) => void;
        /**
         * Names of all checkboxes in the group. Use this when creating a parent checkbox.
         */
        allValues?: string[];
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
    } & HeadlessUIComponentProps<'div', State>;

    export type ChangeEventReason = 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
