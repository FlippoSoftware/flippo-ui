import React from 'react';

import { RadioCardMachine } from '@flippo-software/core-components/radio-card';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider';
import { useRadioGroupContext } from '../../RadioGroup/RadioGroupContext';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { RadioCardRootContext } from './RadioCardRootContext';
import { RadioCardRootDataAttributes } from './RadioCardRootDataAttributes';

import type { RadioCardRootContextValue } from './RadioCardRootContext';

const stateAttributesMapping = {
    checked(value: boolean): Record<string, string> {
        if (value) {
            return { [RadioCardRootDataAttributes.checked]: '' };
        }
        return { [RadioCardRootDataAttributes.unchecked]: '' };
    },
    disabled(value: boolean) {
        if (value) {
            return { [RadioCardRootDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    },
    readOnly(value: boolean) {
        if (value) {
            return { [RadioCardRootDataAttributes.readonly]: '' } as Record<string, string>;
        }
        return null;
    },
    required(value: boolean) {
        if (value) {
            return { [RadioCardRootDataAttributes.required]: '' } as Record<string, string>;
        }
        return null;
    },
    ...fieldValidityMapping
};

/**
 * A selectable card that acts as a radio button.
 * Renders a `<div>` element and a hidden `<input>` beside.
 */
export function RadioCardRoot(componentProps: RadioCardRoot.Props) {
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
        ref,
        ...elementProps
    } = componentProps;

    const { group } = useRadioGroupContext();
    const { field } = useFieldRootContext();
    const fieldItemContext = useFieldItemContext();
    const { labelable } = useLabelableContext();

    const defaultId = useHeadlessUiId() as string;

    const card = useMachine((options) => new RadioCardMachine(options), {
        value,
        disabled,
        readOnly,
        required,
        group,
        field,
        fieldItemDisabled: fieldItemContext.disabled,
        labelable,
        defaultId
    });
    const state: RadioCardRoot.State = useMachineState(card);
    const track = useTracker();

    const contextValue: RadioCardRootContextValue = state;

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, card.setRadioElement],
        props: [elementProps, (props) => track(() => toReactProps(card.getRootProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    const inputRef = React.useCallback(
        (inputElement: HTMLInputElement | null) => {
            card.setInputElement(inputElement);
            if (typeof inputRefProp === 'function') {
                inputRefProp(inputElement);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = inputElement;
            }
        },
        [card, inputRefProp]
    );

    return (
        <RadioCardRootContext.Provider value={contextValue}>
            {element}
            <input {...track(() => toReactProps(card.getInputProps()))} ref={inputRef} />
        </RadioCardRootContext.Provider>
    );
}

export type RadioCardRootState = {
    /** Whether the card is currently selected. */
    checked: boolean;
    /** Whether the component should ignore user interaction. */
    disabled: boolean;
    /** Whether the user should be unable to change the selection. */
    readOnly: boolean;
    /** Whether the user must make a selection before submitting a form. */
    required: boolean;
} & FieldRoot.State;

export type RadioCardRootProps = {
    /** The unique identifying value of this card in the group. */
    value: any;
    /** Whether the component should ignore user interaction. */
    disabled?: boolean;
    /** Whether the user must choose a value before submitting a form. */
    required?: boolean;
    /** Whether the user should be unable to change the selection. */
    readOnly?: boolean;
    /** A ref to access the hidden input element. */
    inputRef?: React.Ref<HTMLInputElement>;
} & Omit<HeadlessUIComponentProps<'div', RadioCardRoot.State>, 'value'>;

export type RadioCardRootChangeEventDetails = HeadlessUIChangeEventDetails<typeof REASONS.none>;

export namespace RadioCardRoot {
    export type State = RadioCardRootState;
    export type Props = RadioCardRootProps;
    export type ChangeEventDetails = RadioCardRootChangeEventDetails;
}
