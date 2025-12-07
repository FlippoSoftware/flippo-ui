import React from 'react';

import { useIsoLayoutEffect, useMergedRef } from '@flippo-ui/hooks';

import { EMPTY_OBJECT } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { NOOP } from '~@lib/noop';
import { REASONS } from '~@lib/reason';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { ACTIVE_COMPOSITE_ITEM } from '../../Composite/constants';
import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext, useLabelableId } from '../../LabelableProvider';
import { useRadioGroupContext } from '../../RadioGroup/RadioGroupContext';
import { useButton } from '../../use-button';
import { radioStyleHookMapping } from '../utils/styleHooks';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { RadioRootContext } from './RadioRootContext';

import type { RadioRootContextValue } from './RadioRootContext';

/**
 * Represents the radio button itself.
 * Renders a `<button>` element and a hidden `<input>` beside.
 *
 * Documentation: [Base UI Radio](https://base-ui.com/react/components/radio)
 */
export function RadioRoot(componentProps: RadioRoot.Props) {
    const {
        render,
        className,
        disabled: disabledProp = false,
        readOnly: readOnlyProp = false,
        required: requiredProp = false,
        value,
        inputRef: inputRefProp,
        nativeButton = false,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const {
        disabled: disabledGroup,
        readOnly: readOnlyGroup,
        required: requiredGroup,
        checkedValue,
        setCheckedValue,
        touched,
        setTouched,
        validation,
        registerControlRef
    } = useRadioGroupContext();

    const {
        setDirty,
        validityData,
        setTouched: setFieldTouched,
        setFilled,
        state: fieldState,
        disabled: fieldDisabled
    } = useFieldRootContext();
    const fieldItemContext = useFieldItemContext();
    const { labelId, getDescriptionProps } = useLabelableContext();

    const disabled = fieldDisabled || fieldItemContext.disabled || disabledGroup || disabledProp;
    const readOnly = readOnlyGroup || readOnlyProp;
    const required = requiredGroup || requiredProp;

    const checked = checkedValue === value;

    const radioRef = React.useRef<HTMLElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRef(inputRefProp, inputRef);

    useIsoLayoutEffect(() => {
        if (inputRef.current?.checked) {
            setFilled(true);
        }
    }, [setFilled]);

    const id = useHeadlessUiId();
    const inputId = useLabelableId({
        id: idProp,
        implicit: false,
        controlRef: radioRef
    });

    const rootProps: React.ComponentProps<'button'> = {
        'role': 'radio',
        'aria-checked': checked,
        'aria-required': required || undefined,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-labelledby': labelId,
        [ACTIVE_COMPOSITE_ITEM as string]: checked ? '' : undefined,
        id,
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
    };

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const inputProps: React.ComponentPropsWithRef<'input'> = React.useMemo(
        () => ({
            'type': 'radio',
            'ref': mergedInputRef,
            'id': inputId,
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

                const details = createChangeEventDetails(REASONS.none, event.nativeEvent);

                if (details.isCanceled) {
                    return;
                }

                setFieldTouched(true);
                setDirty(value !== validityData.initialValue);
                setFilled(true);
                setCheckedValue(value, details);
            },
            onFocus() {
                radioRef.current?.focus();
            }
        }),
        [
            checked,
            disabled,
            inputId,
            mergedInputRef,
            readOnly,
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

    const contextValue: RadioRootContextValue = React.useMemo(() => state, [state]);

    const isRadioGroup = setCheckedValue !== NOOP;

    const refs = [ref, registerControlRef, radioRef, buttonRef];
    const props = [
        rootProps,
        getDescriptionProps,
        validation?.getValidationProps ?? EMPTY_OBJECT,
        elementProps,
        getButtonProps
    ];

    const element = useRenderElement('span', componentProps, {
        enabled: !isRadioGroup,
        state,
        ref: refs,
        props,
        customStyleHookMapping: radioStyleHookMapping
    });

    return (
        <RadioRootContext.Provider value={contextValue}>
            {isRadioGroup
                ? (
                    <CompositeItem
                      tag={'span'}
                      render={render}
                      className={className}
                      state={state}
                      refs={refs}
                      props={props}
                      stateAttributesMapping={radioStyleHookMapping}
                    />
                )
                : (
                    element
                )}
            <input {...inputProps} />
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
} & NonNativeButtonProps & Omit<HeadlessUIComponentProps<'span', RadioRoot.State>, 'value'>;

export namespace RadioRoot {
    export type State = RadioRootState;
    export type Props = RadioRootProps;
}
