import React from 'react';

import { RadioMachine } from '@flippo-software/core-components/radio';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';
import { useRadioGroupContext } from '../../RadioGroup/RadioGroupContext';
import { radioStyleHookMapping } from '../utils/styleHooks';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { RadioRootContext } from './RadioRootContext';

import type { RadioRootContextValue } from './RadioRootContext';

/**
 * Represents the radio button itself.
 * Renders a `<span>` element and a hidden `<input>` beside.
 */
export function RadioRoot(componentProps: RadioRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled,
        readOnly,
        required,
        value,
        inputRef: inputRefProp,
        nativeButton = false,
        id,
        ref,
        ...elementProps
    } = componentProps;

    const { group } = useRadioGroupContext();
    const { field } = useFieldRootContext();
    const fieldItemContext = useFieldItemContext();
    const { labelable } = useLabelableContext();

    const defaultId = useHeadlessUiId() as string;
    const defaultInputId = useHeadlessUiId() as string;

    const radio = useMachine((options) => new RadioMachine(options), {
        value,
        disabled,
        readOnly,
        required,
        nativeButton,
        id,
        group,
        field,
        fieldItemDisabled: fieldItemContext.disabled,
        labelable,
        defaultId,
        defaultInputId
    });
    const state: RadioRoot.State = useMachineState(radio);
    const track = useTracker();

    useIsoLayoutEffect(() => radio.registerId(), [radio, id]);

    const contextValue: RadioRootContextValue = React.useMemo(() => state, [state]);

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [ref, radio.setRadioElement],
        props: [elementProps, (props) => track(() => toReactProps(radio.getRootProps(props)))],
        customStyleHookMapping: radioStyleHookMapping
    });

    const inputRef = React.useCallback(
        (inputElement: HTMLInputElement | null) => {
            radio.setInputElement(inputElement);
            if (typeof inputRefProp === 'function') {
                inputRefProp(inputElement);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = inputElement;
            }
        },
        [radio, inputRefProp]
    );

    return (
        <RadioRootContext.Provider value={contextValue}>
            {element}
            <input {...track(() => toReactProps(radio.getInputProps()))} ref={inputRef} />
        </RadioRootContext.Provider>
    );
}

export type RadioRootState = {
    /** Whether the radio button is currently selected. */
    checked: boolean;
    /** Whether the component should ignore user interaction. */
    disabled: boolean;
    /** Whether the user should be unable to select the radio button. */
    readOnly: boolean;
    /** Whether the user must choose a value before submitting a form. */
    required: boolean;
} & FieldRoot.State;
export type RadioRootProps = {
    /** The unique identifying value of the radio in a group. */
    value: any;
    /** Whether the component should ignore user interaction. */
    disabled?: boolean;
    /** Whether the user must choose a value before submitting a form. */
    required?: boolean;
    /** Whether the user should be unable to select the radio button. */
    readOnly?: boolean;
    /** A ref to access the hidden input element. */
    inputRef?: React.Ref<HTMLInputElement>;
} & NonNativeButtonProps &
    Omit<HeadlessUIComponentProps<'span', RadioRoot.State>, 'value'>;

export namespace RadioRoot {
    export type State = RadioRootState;
    export type Props = RadioRootProps;
}
