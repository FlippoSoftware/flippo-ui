import React from 'react';

import { CheckboxCardMachine } from '@flippo-software/core-components/checkbox-card';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import type { CheckboxCardOptions } from '@flippo-software/core-components/checkbox-card';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCheckboxGroupContext } from '../../CheckboxGroup/CheckboxGroupContext';
import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { CheckboxCardRootContext } from './CheckboxCardRootContext';
import { CheckboxCardRootDataAttributes } from './CheckboxCardRootDataAttributes';

const stateAttributesMapping = {
    checked(value: boolean): Record<string, string> {
        if (value) {
            return { [CheckboxCardRootDataAttributes.checked]: '' };
        }
        return { [CheckboxCardRootDataAttributes.unchecked]: '' };
    },
    indeterminate(value: boolean): Record<string, string> | null {
        if (value) {
            return { [CheckboxCardRootDataAttributes.indeterminate]: '' };
        }
        return null;
    },
    disabled(value: boolean) {
        if (value) {
            return { [CheckboxCardRootDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    },
    required(value: boolean) {
        if (value) {
            return { [CheckboxCardRootDataAttributes.required]: '' } as Record<string, string>;
        }
        return null;
    },
    ...fieldValidityMapping
};

/**
 * A selectable card that acts as a checkbox.
 * Renders a `<div>` element and a hidden `<input>` beside.
 */
export function CheckboxCardRoot(componentProps: CheckboxCardRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        checked,
        defaultChecked,
        disabled,
        indeterminate,
        required,
        value,
        name,
        onCheckedChange,
        inputRef: inputRefProp,
        ref,
        ...elementProps
    } = componentProps;

    const { field } = useFieldRootContext();
    const fieldItemContext = useFieldItemContext();
    const { labelable } = useLabelableContext();
    const groupContext = useCheckboxGroupContext();

    const fieldId = useHeadlessUiId() as string;

    const card = useMachine((options) => new CheckboxCardMachine(options), {
        checked,
        defaultChecked,
        disabled,
        indeterminate,
        required,
        value,
        name,
        onCheckedChange: onCheckedChange as CheckboxCardOptions['onCheckedChange'],
        field,
        fieldItemDisabled: fieldItemContext.disabled,
        labelable,
        group: groupContext?.group,
        fieldId
    });
    const state: CheckboxCardRoot.State = useMachineState(card);
    const track = useTracker();

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => card.registerField());

    useIsoLayoutEffect(() => {
        card.syncInput();
    }, [card, state.checked, state.indeterminate]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, card.setCardElement],
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

    const uncheckedInputProps = track(() => card.getUncheckedInputProps());

    return (
        <CheckboxCardRootContext.Provider value={state}>
            {element}
            {uncheckedInputProps && <input {...track(() => toReactProps(uncheckedInputProps))} />}
            <input {...track(() => toReactProps(card.getInputProps()))} ref={inputRef} />
        </CheckboxCardRootContext.Provider>
    );
}

export type CheckboxCardRootState = {
    /** Whether the card is checked. */
    checked: boolean;
    /** Whether the card is in an indeterminate state. */
    indeterminate: boolean;
    /** Whether the component should ignore user interaction. */
    disabled: boolean;
    /** Whether the user must check this before submitting a form. */
    required: boolean;
} & FieldRoot.State;

export type CheckboxCardRootProps = {
    /**
     * The controlled checked state.
     * Uncontrolled counterpart: `defaultChecked`.
     */
    checked?: boolean;
    /**
     * The initial checked state (uncontrolled).
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the checkbox is in an indeterminate (neither checked nor unchecked) state.
     * @default false
     */
    indeterminate?: boolean;
    /**
     * Whether the user must check this before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * The value submitted in a CheckboxGroup or form.
     * Required when used inside CheckboxGroup.
     */
    value?: string;
    /**
     * Identifies the field when a form is submitted (standalone mode).
     */
    name?: string;
    /**
     * A ref to access the hidden input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * Callback fired when the checked state changes (standalone mode).
     */
    onCheckedChange?: (checked: boolean, eventDetails: CheckboxCardRoot.ChangeEventDetails) => void;
} & Omit<HeadlessUIComponentProps<'div', CheckboxCardRoot.State>, 'value'>;

export type CheckboxCardRootChangeEventDetails = HeadlessUIChangeEventDetails<typeof REASONS.none>;

export namespace CheckboxCardRoot {
    export type State = CheckboxCardRootState;
    export type Props = CheckboxCardRootProps;
    export type ChangeEventDetails = CheckboxCardRootChangeEventDetails;
}
