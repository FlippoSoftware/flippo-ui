import React from 'react';

import { SegmentedControlMachine } from '@flippo-software/core-components/segmented-control';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import type { SegmentedControlOptions } from '@flippo-software/core-components/segmented-control';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeMachineProvider } from '../../Composite/root/CompositeMachineProvider';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useFieldsetRootContext } from '../../Fieldset/root/FieldsetRootContext';
import { useLabelableContext } from '../../LabelableProvider';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { SegmentedControlContext } from './SegmentedControlRootContext';
import { SegmentedControlRootDataAttributes } from './SegmentedControlRootDataAttributes';

import type { SegmentedControlContextValue } from './SegmentedControlRootContext';

const stateAttributesMapping = {
    disabled(value: boolean) {
        if (value) {
            return { [SegmentedControlRootDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    },
    readOnly(value: boolean) {
        if (value) {
            return { [SegmentedControlRootDataAttributes.readonly]: '' } as Record<string, string>;
        }
        return null;
    },
    ...fieldValidityMapping
};

/**
 * A set of mutually exclusive options shown as buttons.
 * Renders a `<div>` element and a hidden `<input>` beside.
 */
export function SegmentedControlRoot(componentProps: SegmentedControlRoot.Props) {
    const {
        value,
        defaultValue = null,
        onValueChange,
        disabled,
        readOnly,
        required,
        orientation = 'horizontal',
        loopFocus = true,
        name,
        inputRef: inputRefProp,
        id: idProp,
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { field, state: fieldState } = useFieldRootContext();
    const { labelable } = useLabelableContext();
    const { fieldset } = useFieldsetRootContext();
    const direction = useDirection();

    const id = useHeadlessUiId(idProp) as string;

    const control = useMachine((options) => new SegmentedControlMachine(options), {
        value,
        defaultValue,
        onValueChange: onValueChange as SegmentedControlOptions['onValueChange'],
        disabled,
        readOnly,
        required,
        orientation,
        loopFocus,
        name,
        field,
        fieldset,
        labelable,
        id,
        direction
    });
    const track = useTracker();

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => control.registerField());

    const { disabled: controlDisabled, readOnly: controlReadOnly } = track(() => control.getState());
    const controlValue = control.value;

    // biome-ignore lint/correctness/useExhaustiveDependencies: the machine state derives from these.
    const state: SegmentedControlRoot.State = React.useMemo(
        () => ({ ...fieldState, ...track(() => control.getState()) }),
        [fieldState, control, controlValue, controlDisabled, controlReadOnly, orientation]
    );

    const contextValue: SegmentedControlContextValue = React.useMemo(
        () => ({
            value: controlValue,
            setValue: control.setValue as SegmentedControlContextValue['setValue'],
            disabled: controlDisabled,
            readOnly: controlReadOnly,
            orientation,
            control
        }),
        [controlValue, control, controlDisabled, controlReadOnly, orientation]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, control.setRootElement],
        props: [elementProps, (props) => track(() => toReactProps(control.getRootProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    const inputRef = React.useCallback(
        (inputElement: HTMLInputElement | null) => {
            control.setInputElement(inputElement);
            if (typeof inputRefProp === 'function') {
                inputRefProp(inputElement);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = inputElement;
            }
        },
        [control, inputRefProp]
    );

    return (
        <SegmentedControlContext.Provider value={contextValue}>
            <CompositeMachineProvider composite={control.composite}>{element}</CompositeMachineProvider>
            <input {...track(() => toReactProps(control.getInputProps(elementProps['aria-labelledby'])))} ref={inputRef} />
        </SegmentedControlContext.Provider>
    );
}

export type SegmentedControlRootState = {
    /** Whether the user should be unable to change the selected value. */
    readOnly: boolean;
    /** The orientation of the segmented control. */
    orientation: Orientation;
} & FieldRoot.State;

export type SegmentedControlRootProps = {
    /**
     * The controlled selected value.
     * Uncontrolled counterpart: `defaultValue`.
     */
    value?: string | null;
    /**
     * The initially selected value (uncontrolled).
     * @default null
     */
    defaultValue?: string | null;
    /**
     * Callback fired when the selected value changes.
     */
    onValueChange?: (value: string, eventDetails: SegmentedControlRoot.ChangeEventDetails) => void;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the selected value can be changed.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the user must select a value before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * The orientation of the component — controls arrow-key navigation direction.
     * @default 'horizontal'
     */
    orientation?: Orientation;
    /**
     * Whether keyboard focus loops back to the first item after the last.
     * @default true
     */
    loopFocus?: boolean;
    /**
     * Identifies the field when a form is submitted.
     */
    name?: string;
    /**
     * A ref to access the hidden input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * The id of the component.
     */
    id?: string;
} & HeadlessUIComponentProps<'div', SegmentedControlRoot.State>;

export type SegmentedControlRootChangeEventReason = typeof REASONS.none;
export type SegmentedControlRootChangeEventDetails = HeadlessUIChangeEventDetails<SegmentedControlRoot.ChangeEventReason>;

export namespace SegmentedControlRoot {
    export type State = SegmentedControlRootState;
    export type Props = SegmentedControlRootProps;
    export type ChangeEventReason = SegmentedControlRootChangeEventReason;
    export type ChangeEventDetails = SegmentedControlRootChangeEventDetails;
}
