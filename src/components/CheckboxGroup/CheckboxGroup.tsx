import React from 'react';

import { CheckboxGroupMachine } from '@flippo-software/core-components/checkbox-group';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import type { CheckboxGroupOptions } from '@flippo-software/core-components/checkbox-group';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldRootContext } from '../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../Field/utils/constants';
import { useLabelableContext } from '../LabelableProvider/LabelableContext';

import type { FieldRoot } from '../Field/root/FieldRoot';

import { CheckboxGroupContext } from './CheckboxGroupContext';

import type { CheckboxGroupContextValue } from './CheckboxGroupContext';

/**
 * Provides a shared state to a series of checkboxes.
 * Renders a `<div>` element.
 */
export function CheckboxGroup(componentProps: CheckboxGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        allValues,
        defaultValue,
        disabled = false,
        id: idProp,
        onValueChange,
        value,
        ref,
        ...elementProps
    } = componentProps;

    const { field, state: fieldState, validation } = useFieldRootContext();
    const { labelable } = useLabelableContext();

    const id = useHeadlessUiId(idProp) as string;
    const parentId = useHeadlessUiId() as string;

    const group = useMachine((options) => new CheckboxGroupMachine(options), {
        value,
        defaultValue,
        onValueChange: onValueChange as CheckboxGroupOptions['onValueChange'],
        allValues,
        disabled,
        field,
        labelable,
        id,
        parentId
    });
    const track = useTracker();

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => group.registerField());

    const groupValue = track(() => group.value);
    const groupDisabled = track(() => group.disabled);

    const state: CheckboxGroup.State = React.useMemo(() => ({ ...fieldState, disabled: groupDisabled }), [fieldState, groupDisabled]);

    const contextValue: CheckboxGroupContextValue = React.useMemo(
        () => ({
            allValues,
            value: groupValue,
            defaultValue,
            setValue: group.setValue as CheckboxGroupContextValue['setValue'],
            parent: group.parent,
            disabled: groupDisabled,
            validation,
            registerControlRef: group.registerControlRef,
            group
        }),
        [allValues, groupValue, defaultValue, group, groupDisabled, validation]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [toReactProps(group.getRootProps()), elementProps],
        customStyleHookMapping: fieldValidityMapping
    });

    return <CheckboxGroupContext.Provider value={contextValue}>{element}</CheckboxGroupContext.Provider>;
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
export type CheckboxGroupChangeEventDetails = HeadlessUIChangeEventDetails<CheckboxGroup.ChangeEventReason>;

export namespace CheckboxGroup {
    export type State = CheckboxGroupState;
    export type Props = CheckboxGroupProps;
    export type ChangeEventReason = CheckboxGroupChangeEventReason;
    export type ChangeEventDetails = CheckboxGroupChangeEventDetails;
}
