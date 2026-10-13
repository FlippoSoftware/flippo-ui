import React from 'react';

import { PinInputMachine } from '@flippo-software/core-components/pin-input';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import type { PinInputOptions } from '@flippo-software/core-components/pin-input';

import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';
import { pinInputStyleHookMapping } from '../utils/styleHooks';

import type { CompositeMetadata, CompositeRoot } from '../../Composite';
import type { Field } from '../../Field';

import { PinInputRootContext } from './PinInputRootContext';

import type { PinInputRootContextValue } from './PinInputRootContext';

/**
 * Groups all parts of the PIN input and manages its value.
 * Renders a `<div>` element and a hidden `<input>` beside.
 */
export function PinInputRoot(componentProps: PinInputRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled,
        readOnly = false,
        required,
        onValueChange,
        onValueComplete,
        value,
        defaultValue,
        name,
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

    const { field, state: fieldState } = useFieldRootContext();
    const { labelable } = useLabelableContext();
    const direction = useDirection();

    const id = useHeadlessUiId(idProp) as string;

    const pinInput = useMachine((options) => new PinInputMachine(options), {
        disabled,
        readOnly,
        required,
        value,
        defaultValue,
        name,
        placeholder,
        otp,
        mask,
        blurOnComplete,
        selectOnFocus,
        pattern,
        type,
        onValueChange: onValueChange as PinInputOptions['onValueChange'],
        onValueComplete: onValueComplete as PinInputOptions['onValueComplete'],
        field,
        labelable,
        id,
        direction
    });
    const internalState = useStoreState(pinInput.store);

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => pinInput.registerField());

    const { readOnly: machineReadOnly } = pinInput.getState();
    const state: PinInputRoot.State = React.useMemo(() => ({ ...fieldState, readOnly: machineReadOnly }), [fieldState, machineReadOnly]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a new value when the machine's state changes.
    const contextValue: PinInputRootContextValue = React.useMemo(() => ({ pinInput, state }), [pinInput, state, internalState]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: [elementProps, (props) => toReactProps(pinInput.getRootProps(props))],
        customStyleHookMapping: pinInputStyleHookMapping
    });

    const inputRef = React.useCallback(
        (inputElement: HTMLInputElement | null) => {
            pinInput.setInputElement(inputElement);
            if (typeof inputRefProp === 'function') {
                inputRefProp(inputElement);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = inputElement;
            }
        },
        [pinInput, inputRefProp]
    );

    return (
        <PinInputRootContext value={contextValue}>
            <CompositeList
                registry={pinInput.registry as never}
                elementsRef={pinInput.elementsRef as React.RefObject<Array<HTMLElement | null>>}
            >
                {element}
            </CompositeList>
            <input {...toReactProps(pinInput.getInputProps())} ref={inputRef} />
        </PinInputRootContext>
    );
}

export namespace PinInputRoot {
    export type InputMetadata = CompositeMetadata<{
        value: string;
    }>;

    export type State = {
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
