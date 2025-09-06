'use client';

import React from 'react';

import { useIsoLayoutEffect, useMergedRef } from '@flippo-ui/hooks';

import { EMPTY_OBJECT } from '@lib/constants';
import { useHeadlessUiId, useRenderElement } from '@lib/hooks';
import { NOOP } from '@lib/noop';
import { visuallyHidden } from '@lib/visuallyHidden';

import type { HeadlessUIComponentProps, NativeButtonProps } from '@lib/types';

import { ACTIVE_COMPOSITE_ITEM } from '../../Composite/constants';
import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useRadioGroupContext } from '../../RadioGroup/RadioGroupContext';
import { useButton } from '../../use-button';
import { radioStyleHookMapping } from '../utils/styleHooks';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { RadioRootContext } from './RadioRootContext';

import type { TRadioRootContext } from './RadioRootContext';

/**
 * Represents the radio button itself.
 * Renders a `<button>` element and a hidden `<input>` beside.
 *
 * Documentation: [Base UI Radio](https://base-ui.com/react/components/radio)
 */
export function RadioRoot(componentProps: RadioRoot.Props) {
    const {
        className,
        render,
        disabled: disabledProp = false,
        readOnly: readOnlyProp = false,
        required: requiredProp = false,
        value,
        inputRef: inputRefProp,
        nativeButton = true,
        ref: refProp,
        ...elementProps
    } = componentProps;

    const {
        disabled: disabledRoot,
        readOnly: readOnlyRoot,
        required: requiredRoot,
        checkedValue,
        setCheckedValue,
        onValueChange,
        touched,
        setTouched,
        fieldControlValidation,
        registerControlRef
    } = useRadioGroupContext();

    const { state: fieldState, disabled: fieldDisabled } = useFieldRootContext();

    const disabled = fieldDisabled || disabledRoot || disabledProp;
    const readOnly = readOnlyRoot || readOnlyProp;
    const required = requiredRoot || requiredProp;

    const {
        setDirty,
        validityData,
        setTouched: setFieldTouched,
        setFilled
    } = useFieldRootContext();

    const checked = checkedValue === value;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const ref = useMergedRef(inputRefProp, inputRef);

    useIsoLayoutEffect(() => {
        if (inputRef.current?.checked) {
            setFilled(true);
        }
    }, [setFilled]);

    const rootProps: React.ComponentPropsWithRef<'button'> = React.useMemo(
        () => ({
            'role': 'radio',
            'aria-checked': checked,
            'aria-required': required || undefined,
            'aria-disabled': disabled || undefined,
            'aria-readonly': readOnly || undefined,
            [ACTIVE_COMPOSITE_ITEM as string]: checked ? '' : undefined,
            disabled,
            onKeyDown(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                }
            },
            onClick(event) {
                if (event.defaultPrevented || disabled || readOnly) {
                    return;
                }

                event.preventDefault();

                inputRef.current?.click();
            },
            onFocus(event) {
                if (event.defaultPrevented || disabled || readOnly || !touched) {
                    return;
                }

                inputRef.current?.click();

                setTouched(false);
            }
        }),
        [
            checked,
            required,
            disabled,
            readOnly,
            touched,
            setTouched
        ]
    );

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const id = useHeadlessUiId();

    const inputProps: React.ComponentPropsWithRef<'input'> = React.useMemo(
        () => ({
            'type': 'radio',
            ref,
            // Set `id` to stop Chrome warning about an unassociated input
            id,
            'tabIndex': -1,
            'style': visuallyHidden,
            'aria-hidden': true,
            disabled,
            checked,
            required,
            readOnly,
            onChange(event) {
                // Workaround for https://github.com/facebook/react/issues/9023
                if (event.nativeEvent.defaultPrevented) {
                    return;
                }

                if (disabled || readOnly || value === undefined) {
                    return;
                }

                setFieldTouched(true);
                setDirty(value !== validityData.initialValue);
                setCheckedValue(value);
                setFilled(true);
                onValueChange?.(value, event.nativeEvent);
            }
        }),
        [
            checked,
            disabled,
            id,
            onValueChange,
            readOnly,
            ref,
            required,
            setCheckedValue,
            setDirty,
            setFieldTouched,
            setFilled,
            validityData.initialValue,
            value
        ]
    );

    const state: RadioRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            required,
            disabled,
            readOnly,
            checked
        }),
        [
            fieldState,
            disabled,
            readOnly,
            checked,
            required
        ]
    );

    const contextValue: TRadioRootContext = React.useMemo(() => state, [state]);

    const isRadioGroup = setCheckedValue !== NOOP;

    const refs = [refProp, registerControlRef, buttonRef];
    const props = [
        rootProps,
        fieldControlValidation?.getValidationProps ?? EMPTY_OBJECT,
        elementProps,
        getButtonProps
    ];

    const element = useRenderElement('button', componentProps, {
        enabled: !isRadioGroup,
        state,
        ref: refs,
        props,
        customStyleHookMapping: radioStyleHookMapping
    });

    return (
        <RadioRootContext value={contextValue}>
            {isRadioGroup
                ? (
                    <CompositeItem
                      tag={'button'}
                      render={render}
                      className={className}
                      state={state}
                      refs={refs}
                      props={props}
                      customStyleHookMapping={radioStyleHookMapping}
                    />
                )
                : (
                    element
                )}
            <input {...inputProps} />
        </RadioRootContext>
    );
}

export namespace RadioRoot {
    export type State = {
        /**
         * Whether the radio button is currently selected.
         */
        checked: boolean;
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
        /**
         * Whether the user should be unable to select the radio button.
         */
        readOnly: boolean;
        /**
         * Whether the user must choose a value before submitting a form.
         */
        required: boolean;
    } & FieldRoot.State;

    export type Props = {
        /**
         * The unique identifying value of the radio in a group.
         */
        value: any;
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
        /**
         * Whether the user must choose a value before submitting a form.
         * @default false
         */
        required?: boolean;
        /**
         * Whether the user should be unable to select the radio button.
         * @default false
         */
        readOnly?: boolean;
        /**
         * A ref to access the hidden input element.
         */
        inputRef?: React.Ref<HTMLInputElement>;
    } & NativeButtonProps & Omit<HeadlessUIComponentProps<'button', State>, 'value'>;
}
