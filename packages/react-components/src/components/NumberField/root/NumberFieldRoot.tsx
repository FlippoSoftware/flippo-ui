import React from 'react';

import { NumberFieldMachine } from '@flippo-software/core-components/number-field';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import type { NumberFieldOptions } from '@flippo-software/core-components/number-field';

import { toReactProps, useMachine, useMachineState, useStoreState } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails, HeadlessUIGenericEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';
import { styleHookMapping } from '../utils/styleHooks';

import type { FieldRoot } from '../../Field/root/FieldRoot';
import type { ChangeEventCustomProperties } from '../utils/types';

import { NumberFieldRootContext } from './NumberFieldRootContext';

/**
 * Groups all parts of the number field and manages its state.
 * Renders a `<div>` element.
 */
export function NumberFieldRoot(componentProps: NumberFieldRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id,
        min,
        max,
        smallStep,
        step,
        largeStep,
        required,
        disabled,
        readOnly,
        name,
        defaultValue,
        value,
        onValueChange,
        onValueCommitted,
        allowWheelScrub,
        snapOnStep,
        format,
        locale,
        inputRef: inputRefProp,
        ref,
        ...elementProps
    } = componentProps;

    const { field } = useFieldRootContext();
    const { labelable } = useLabelableContext();

    const defaultId = useHeadlessUiId() as string;

    const numberField = useMachine((options) => new NumberFieldMachine(options), {
        id,
        min,
        max,
        smallStep,
        step,
        largeStep,
        required,
        disabled,
        readOnly,
        name,
        defaultValue,
        value,
        onValueChange: onValueChange as NumberFieldOptions['onValueChange'],
        onValueCommitted: onValueCommitted as NumberFieldOptions['onValueCommitted'],
        allowWheelScrub,
        snapOnStep,
        format,
        locale,
        field,
        labelable,
        defaultId
    });
    const state: NumberFieldRoot.State = useMachineState(numberField);
    // The input text and mode live in the machine's store.
    const internalState = useStoreState(numberField.store);

    useIsoLayoutEffect(() => numberField.registerId(), [numberField, id]);

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => numberField.registerField());

    // biome-ignore lint/correctness/useExhaustiveDependencies: a new value when the machine's store changes.
    const contextValue = React.useMemo(() => ({ numberField, state }), [numberField, state, internalState]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: elementProps,
        customStyleHookMapping: styleHookMapping
    });

    const hiddenInputProps = numberField.getHiddenInputProps();

    return (
        <NumberFieldRootContext.Provider value={contextValue}>
            {element}
            {hiddenInputProps && <input {...toReactProps(hiddenInputProps)} ref={inputRefProp} />}
        </NumberFieldRootContext.Provider>
    );
}

export type NumberFieldRootProps = {
    /**
     * The id of the input element.
     */
    id?: string;
    /**
     * The minimum value of the input element.
     */
    min?: number;
    /**
     * The maximum value of the input element.
     */
    max?: number;
    /**
     * The small step value of the input element when incrementing while the meta key is held. Snaps
     * to multiples of this value.
     * @default 0.1
     */
    smallStep?: number;
    /**
     * Amount to increment and decrement with the buttons and arrow keys,
     * or to scrub with pointer movement in the scrub area.
     * @default 1
     */
    step?: number;
    /**
     * The large step value of the input element when incrementing while the shift key is held. Snaps
     * to multiples of this value.
     * @default 10
     */
    largeStep?: number;
    /**
     * Whether the user must enter a value before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the user should be unable to change the field value.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Identifies the field when a form is submitted.
     */
    name?: string;
    /**
     * The raw numeric value of the field.
     */
    value?: number | null;
    /**
     * The uncontrolled value of the field when it’s initially rendered.
     *
     * To render a controlled number field, use the `value` prop instead.
     */
    defaultValue?: number;
    /**
     * Whether to allow the user to scrub the input value with the mouse wheel while focused and
     * hovering over the input.
     * @default false
     */
    allowWheelScrub?: boolean;
    /**
     * Whether the value should snap to the nearest step when incrementing or decrementing.
     * @default false
     */
    snapOnStep?: boolean;
    /**
     * Options to format the input value.
     */
    format?: Intl.NumberFormatOptions;
    /**
     * Callback fired when the number value changes.
     *
     * The `eventDetails.reason` indicates what triggered the change:
     * - `'input-change'` for parseable typing or programmatic text updates
     * - `'input-clear'` when the field becomes empty
     * - `'input-blur'` when formatting or clamping occurs on blur
     * - `'input-paste'` for paste interactions
     * - `'keyboard'` for keyboard input
     * - `'increment-press'` / `'decrement-press'` for button presses on the increment and decrement controls
     * - `'wheel'` for wheel-based scrubbing
     * - `'scrub'` for scrub area drags
     */
    onValueChange?: (value: number | null, eventDetails: NumberFieldRoot.ChangeEventDetails) => void;
    /**
     * Callback function that is fired when the value is committed.
     * It runs later than `onValueChange`, when:
     * - The input is blurred after typing a value.
     * - The pointer is released after scrubbing or pressing the increment/decrement buttons.
     *
     * It runs simultaneously with `onValueChange` when interacting with the keyboard.
     *
     * **Warning**: This is a generic event not a change event.
     */
    onValueCommitted?: (value: number | null, eventDetails: NumberFieldRoot.CommitEventDetails) => void;
    /**
     * The locale of the input element.
     * Defaults to the user's runtime locale.
     */
    locale?: Intl.LocalesArgument;
    /**
     * A ref to access the hidden input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
} & Omit<HeadlessUIComponentProps<'div', NumberFieldRootState>, 'onChange'>;

export type NumberFieldRootState = {
    /**
     * The raw numeric value of the field.
     */
    value: number | null;
    /**
     * The formatted string value presented in the input element.
     */
    inputValue: string;
    /**
     * Whether the user must enter a value before submitting a form.
     */
    required: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the user should be unable to change the field value.
     */
    readOnly: boolean;
    /**
     * Whether the user is currently scrubbing the field.
     */
    scrubbing: boolean;
} & FieldRoot.State;

export type NumberFieldRootChangeEventReason =
    | typeof REASONS.inputChange
    | typeof REASONS.inputClear
    | typeof REASONS.inputBlur
    | typeof REASONS.inputPaste
    | typeof REASONS.keyboard
    | typeof REASONS.incrementPress
    | typeof REASONS.decrementPress
    | typeof REASONS.wheel
    | typeof REASONS.scrub
    | typeof REASONS.none;
export type NumberFieldRootChangeEventDetails = HeadlessUIChangeEventDetails<NumberFieldRootChangeEventReason, ChangeEventCustomProperties>;

export type NumberFieldRootCommitEventReason =
    | typeof REASONS.inputBlur
    | typeof REASONS.inputClear
    | typeof REASONS.keyboard
    | typeof REASONS.incrementPress
    | typeof REASONS.decrementPress
    | typeof REASONS.wheel
    | typeof REASONS.scrub
    | typeof REASONS.none;
export type NumberFieldRootCommitEventDetails = HeadlessUIGenericEventDetails<NumberFieldRoot.CommitEventReason>;

export namespace NumberFieldRoot {
    export type State = NumberFieldRootState;
    export type Props = NumberFieldRootProps;
    export type ChangeEventReason = NumberFieldRootChangeEventReason;
    export type ChangeEventDetails = NumberFieldRootChangeEventDetails;
    export type CommitEventReason = NumberFieldRootCommitEventReason;
    export type CommitEventDetails = NumberFieldRootCommitEventDetails;
}
