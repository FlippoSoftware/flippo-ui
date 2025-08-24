'use client';
import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo_ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';
import { mergeProps } from '@lib/merge';
import { visuallyHidden } from '@lib/visuallyHidden';

import type { HeadlessUIComponentProps, NativeButtonProps } from '@lib/types';

import { useFieldControlValidation } from '../../Field/control/useFieldControlValidation';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { useFormContext } from '../../Form/FormContext';
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
        nativeButton = true,
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
        labelId,
        setControlId,
        setTouched,
        setDirty,
        validityData,
        setFilled,
        setFocused,
        validationMode,
        disabled: fieldDisabled,
        name: fieldName
    } = useFieldRootContext();

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? elementProps.name;

    const {
        getValidationProps,
        getInputValidationProps,
        inputRef: inputValidationRef,
        commitValidation
    } = useFieldControlValidation();

    const onCheckedChange = useEventCallback(onCheckedChangeProp);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleInputRef = useMergedRef(inputRef, externalInputRef, inputValidationRef);

    const switchRef = React.useRef<HTMLButtonElement | null>(null);

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        const element = switchRef.current;
        if (!element) {
            return undefined;
        }

        if (element.closest('label') != null) {
            setControlId(idProp ?? null);
        }
        else {
            setControlId(id);
        }

        return () => {
            setControlId(undefined);
        };
    }, [id, idProp, setControlId]);

    const [checked, setCheckedState] = useControlledState({
        prop: checkedProp,
        defaultProp: Boolean(defaultChecked),
        caller: 'Switch'
    });

    useField({
        id,
        commitValidation,
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

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const rootProps: React.ComponentPropsWithRef<'button'> = React.useMemo(
        () => ({
            id,
            'role': 'switch',
            disabled,
            'aria-checked': checked,
            'aria-readonly': readOnly || undefined,
            'aria-labelledby': labelId,
            onFocus() {
                setFocused(true);
            },
            onBlur() {
                const element = inputRef.current;
                if (!element) {
                    return;
                }

                setTouched(true);
                setFocused(false);

                if (validationMode === 'onBlur') {
                    commitValidation(element.checked);
                }
            },
            onClick(event) {
                if (event.defaultPrevented || readOnly) {
                    return;
                }

                inputRef?.current?.click();
            }
        }),
        [
            id,
            disabled,
            checked,
            readOnly,
            labelId,
            setFocused,
            setTouched,
            commitValidation,
            validationMode,
            inputRef
        ]
    );

    const inputProps: React.ComponentPropsWithRef<'input'> = React.useMemo(
        () =>
            mergeProps<'input'>(
                {
                    checked,
                    disabled,
                    'id': !name ? `${id}-input` : undefined,
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

                        setDirty(nextChecked !== validityData.initialValue);
                        setFilled(nextChecked);
                        setCheckedState(nextChecked);
                        onCheckedChange?.(nextChecked, event.nativeEvent);
                        clearErrors(name);

                        if (validationMode === 'onChange') {
                            commitValidation(nextChecked);
                        }
                        else {
                            commitValidation(nextChecked, true);
                        }
                    }
                },
                getInputValidationProps
            ),
        [
            checked,
            clearErrors,
            commitValidation,
            disabled,
            getInputValidationProps,
            handleInputRef,
            id,
            name,
            onCheckedChange,
            required,
            setCheckedState,
            setDirty,
            setFilled,
            validationMode,
            validityData.initialValue
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

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, switchRef, buttonRef],
        props: [
            rootProps,
            getValidationProps,
            elementProps,
            getButtonProps
        ],
        customStyleHookMapping: styleHookMapping
    });

    return (
        <SwitchRootContext value={state}>
            {element}
            {!checked && elementProps.name && (
                <input type={'hidden'} name={elementProps.name} value={'off'} />
            )}
            <input {...inputProps} />
        </SwitchRootContext>
    );
}

export namespace SwitchRoot {
    export type State = {
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

    export type Props = {
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
         *
         * @param {boolean} checked The new checked state.
         * @param {Event} event The corresponding event that initiated the change.
         */
        onCheckedChange?: (checked: boolean, event: Event) => void;
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
    } & NativeButtonProps & Omit<HeadlessUIComponentProps<'button', SwitchRoot.State>, 'onChange'>;
}
