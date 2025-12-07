import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { REASONS } from '~@lib/reason';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, NativeButtonProps, NonNativeButtonProps } from '~@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { useFormContext } from '../../Form/FormContext';
import { useLabelableContext, useLabelableId } from '../../LabelableProvider';
import { useButton } from '../../use-button';
import { styleHookMapping } from '../styleHooks';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { SwitchRootContext } from './SwitchRootContext';

/**
 * Represents the switch itself.
 * Renders a `<button>` element and a hidden `<input>` beside.
 *
 * Documentation: [Base UI Switch](https://base-ui.com/react/components/switch)
 */
export function SwitchRoot(componentProps: SwitchRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        checked: checkedProp,
        defaultChecked,
        id: idProp,
        inputRef: externalInputRef,
        name: nameProp,
        nativeButton = false,
        onCheckedChange: onCheckedChangeProp,
        readOnly = false,
        required = false,
        disabled: disabledProp = false,
        ref,
        ...elementProps
    } = componentProps;

    const { clearErrors } = useFormContext();
    const {
        state: fieldState,
        setTouched,
        setDirty,
        validityData,
        setFilled,
        setFocused,
        shouldValidateOnChange,
        validationMode,
        disabled: fieldDisabled,
        name: fieldName,
        validation
    } = useFieldRootContext();
    const { labelId } = useLabelableContext();

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;

    const onCheckedChange = useStableCallback(onCheckedChangeProp);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleInputRef = useMergedRef(inputRef, externalInputRef, validation.inputRef);

    const switchRef = React.useRef<HTMLButtonElement | null>(null);

    const id = useHeadlessUiId();

    const inputId = useLabelableId({
        id: idProp,
        implicit: false,
        controlRef: switchRef
    });

    const [checked, setCheckedState] = useControlledState({
        prop: checkedProp,
        defaultProp: Boolean(defaultChecked),
        caller: 'Switch'
    });

    useField({
        id,
        commit: validation.commit,
        value: checked,
        controlRef: switchRef,
        name,
        getValue: () => checked
    });

    useIsoLayoutEffect(() => {
        if (inputRef.current) {
            setFilled(inputRef.current.checked);
        }
    }, [inputRef, setFilled]);

    useValueChanged(checked, () => {
        clearErrors(name);
        setDirty(checked !== validityData.initialValue);
        setFilled(checked);

        if (shouldValidateOnChange()) {
            validation.commit(checked);
        }
        else {
            validation.commit(checked, true);
        }
    });

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const rootProps: React.ComponentPropsWithRef<'span'> = {
        id,
        'role': 'switch',
        'aria-checked': checked,
        'aria-readonly': readOnly || undefined,
        'aria-labelledby': labelId,
        onFocus() {
            if (!disabled) {
                setFocused(true);
            }
        },
        onBlur() {
            const element = inputRef.current;
            if (!element || disabled) {
                return;
            }

            setTouched(true);
            setFocused(false);

            if (validationMode === 'onBlur') {
                validation.commit(element.checked);
            }
        },
        onClick(event) {
            if (readOnly || disabled) {
                return;
            }

            event.preventDefault();

            inputRef?.current?.click();
        }
    };

    const inputProps: React.ComponentPropsWithRef<'input'> = React.useMemo(
        () =>
            mergeProps<'input'>(
                {
                    checked,
                    disabled,
                    'id': inputId,
                    name,
                    required,
                    'style': visuallyHidden,
                    'tabIndex': -1,
                    'type': 'checkbox',
                    'aria-hidden': true,
                    'ref': handleInputRef,
                    onChange(event) {
                        // Workaround for https://github.com/facebook/react/issues/9023
                        if (event.nativeEvent.defaultPrevented) {
                            return;
                        }

                        const nextChecked = event.target.checked;
                        const eventDetails = createChangeEventDetails(REASONS.none, event.nativeEvent);

                        onCheckedChange?.(nextChecked, eventDetails);

                        if (eventDetails.isCanceled) {
                            return;
                        }

                        setCheckedState(nextChecked);
                    },
                    onFocus() {
                        switchRef.current?.focus();
                    }
                },
                validation.getInputValidationProps
            ),
        [
            checked,
            disabled,
            handleInputRef,
            inputId,
            name,
            onCheckedChange,
            required,
            setCheckedState,
            validation
        ]
    );

    const state: SwitchRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            checked,
            disabled,
            readOnly,
            required
        }),
        [
            fieldState,
            checked,
            disabled,
            readOnly,
            required
        ]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [ref, switchRef, buttonRef],
        props: [rootProps, validation.getValidationProps, elementProps, getButtonProps],
        customStyleHookMapping: styleHookMapping
    });

    return (
        <SwitchRootContext.Provider value={state}>
            {element}
            {!checked && name && <input type={'hidden'} name={name} value={'off'} />}
            <input {...inputProps} />
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
} & NonNativeButtonProps & Omit<HeadlessUIComponentProps<'span', SwitchRoot.State>, 'onChange'>;
export type SwitchRootChangeEventReason = typeof REASONS.none;
export type SwitchRootChangeEventDetails = HeadlessUIChangeEventDetails<SwitchRoot.ChangeEventReason>;

export namespace SwitchRoot {
    export type State = SwitchRootState;
    export type Props = SwitchRootProps;
    export type ChangeEventReason = SwitchRootChangeEventReason;
    export type ChangeEventDetails = SwitchRootChangeEventDetails;
}
