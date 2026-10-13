import React from 'react';

import { SwitchMachine } from '@flippo-software/core-components/switch';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import type { SwitchOptions } from '@flippo-software/core-components/switch';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';
import { styleHookMapping } from '../styleHooks';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { SwitchRootContext } from './SwitchRootContext';

/**
 * Represents the switch itself.
 * Renders a `<span>` element and a hidden `<input>` beside.
 */
export function SwitchRoot(componentProps: SwitchRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        checked,
        defaultChecked,
        id,
        inputRef: externalInputRef,
        name,
        nativeButton = false,
        onCheckedChange,
        readOnly = false,
        required = false,
        disabled = false,
        ref,
        ...elementProps
    } = componentProps;

    const { field } = useFieldRootContext();
    const { labelable } = useLabelableContext();

    const defaultId = useHeadlessUiId() as string;
    const defaultInputId = useHeadlessUiId() as string;

    const switchMachine = useMachine((options) => new SwitchMachine(options), {
        id,
        checked,
        defaultChecked,
        disabled,
        name,
        onCheckedChange: onCheckedChange as SwitchOptions['onCheckedChange'],
        readOnly,
        required,
        nativeButton,
        field,
        labelable,
        defaultId,
        defaultInputId
    });
    const switchState = useMachineState(switchMachine);
    const track = useTracker();
    const { state: fieldState } = useFieldRootContext();
    const state: SwitchRoot.State = React.useMemo(() => ({ ...fieldState, ...switchState }), [fieldState, switchState]);

    useIsoLayoutEffect(() => switchMachine.registerId(), [switchMachine, id]);

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => switchMachine.registerField());

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [switchMachine.setSwitchElement, ref],
        props: [elementProps, (props) => track(() => toReactProps(switchMachine.getRootProps(props)))],
        customStyleHookMapping: styleHookMapping
    });

    const inputRef = React.useCallback(
        (element: HTMLInputElement | null) => {
            switchMachine.setInputElement(element);
            if (typeof externalInputRef === 'function') {
                externalInputRef(element);
            } else if (externalInputRef) {
                (externalInputRef as React.RefObject<HTMLInputElement | null>).current = element;
            }
        },
        [switchMachine, externalInputRef]
    );

    const uncheckedInputProps = track(() => switchMachine.getUncheckedInputProps());

    return (
        <SwitchRootContext.Provider value={state}>
            {element}
            {uncheckedInputProps && <input {...track(() => toReactProps(uncheckedInputProps))} />}
            <input {...track(() => toReactProps(switchMachine.getInputProps()))} ref={inputRef} />
        </SwitchRootContext.Provider>
    );
}

export type SwitchRootState = {
    /**
     * Whether the switch is currently active.
     */
    checked: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the user should be unable to activate or deactivate the switch.
     */
    readOnly: boolean;
    /**
     * Whether the user must activate the switch before submitting a form.
     */
    required: boolean;
} & FieldRoot.State;

export type SwitchRootProps = {
    /**
     * The id of the switch element.
     */
    id?: string;
    /**
     * Whether the switch is currently active.
     *
     * To render an uncontrolled switch, use the `defaultChecked` prop instead.
     */
    checked?: boolean;
    /**
     * Whether the switch is initially active.
     *
     * To render a controlled switch, use the `checked` prop instead.
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * A ref to access the hidden `<input>` element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * Identifies the field when a form is submitted.
     */
    name?: string;
    /**
     * Event handler called when the switch is activated or deactivated.
     */
    onCheckedChange?: (checked: boolean, eventDetails: SwitchRoot.ChangeEventDetails) => void;
    /**
     * Whether the user should be unable to activate or deactivate the switch.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the user must activate the switch before submitting a form.
     * @default false
     */
    required?: boolean;
} & NonNativeButtonProps &
    Omit<HeadlessUIComponentProps<'span', SwitchRoot.State>, 'onChange'>;
export type SwitchRootChangeEventReason = typeof REASONS.none;
export type SwitchRootChangeEventDetails = HeadlessUIChangeEventDetails<SwitchRoot.ChangeEventReason>;

export namespace SwitchRoot {
    export type State = SwitchRootState;
    export type Props = SwitchRootProps;
    export type ChangeEventReason = SwitchRootChangeEventReason;
    export type ChangeEventDetails = SwitchRootChangeEventDetails;
}
