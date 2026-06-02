import React from 'react';

import { useIsoLayoutEffect, useMergedRef } from '@flippo-ui/hooks';

import { EMPTY_OBJECT } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { NOOP } from '~@lib/noop';
import { REASONS } from '~@lib/reason';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { ACTIVE_COMPOSITE_ITEM } from '../../Composite/constants';
import { CompositeItem } from '../../Composite/item/CompositeItem';
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
 * A full-block radio option styled as a card.
 * The entire card surface is the interactive target.
 *
 * Must be placed within a RadioGroup to participate in group state.
 *
 * @example
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <RadioCard.Root value="starter">
 *     <RadioCard.Indicator />
 *     <span>Starter plan</span>
 *   </RadioCard.Root>
 *   <RadioCard.Root value="pro">
 *     <RadioCard.Indicator />
 *     <span>Pro plan</span>
 *   </RadioCard.Root>
 * </RadioGroup>
 */
export function RadioCardRoot(componentProps: RadioCardRoot.Props) {
    const {
        render,
        className,
        disabled: disabledProp = false,
        readOnly: readOnlyProp = false,
        required: requiredProp = false,
        value,
        inputRef: inputRefProp,
        ref,
        ...elementProps
    } = componentProps;

    const {
        disabled: groupDisabled,
        readOnly: groupReadOnly,
        required: groupRequired,
        checkedValue,
        setCheckedValue,
        touched,
        setTouched,
        validation: groupValidation,
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

    const disabled = (fieldDisabled || fieldItemContext.disabled || groupDisabled || disabledProp) ?? false;
    const readOnly = (groupReadOnly || readOnlyProp) ?? false;
    const required = (groupRequired || requiredProp) ?? false;
    const checked = checkedValue === value;

    const cardRef = React.useRef<HTMLElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRef(inputRefProp, inputRef);

    const isInGroup = setCheckedValue !== NOOP;

    useIsoLayoutEffect(() => {
        if (inputRef.current?.checked) {
            setFilled(true);
        }
    }, [setFilled]);

    const state: RadioCardRoot.State = React.useMemo(
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

    const contextValue: RadioCardRootContextValue = state;

    const rootProps = {
        'role': 'radio',
        'aria-checked': checked,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-required': required || undefined,
        'aria-labelledby': labelId,
        [ACTIVE_COMPOSITE_ITEM as string]: checked ? '' : undefined,
        'tabIndex': disabled ? -1 : 0,
        onKeyDown(event: React.KeyboardEvent) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        },
        onClick(event: React.MouseEvent) {
            if (event.defaultPrevented || disabled || readOnly)
                return;
            event.preventDefault();
            inputRef.current?.click();
        },
        onFocus(event: React.FocusEvent) {
            if (event.defaultPrevented || disabled || readOnly || !touched)
                return;
            inputRef.current?.click();
            setTouched(false);
        }
    };

    const inputProps: React.ComponentPropsWithRef<'input'> = React.useMemo(
        () => ({
            'type': 'radio',
            'ref': mergedInputRef,
            'tabIndex': -1,
            'style': visuallyHidden,
            'aria-hidden': true,
            disabled,
            checked,
            required,
            readOnly,
            onChange(event: React.ChangeEvent<HTMLInputElement>) {
                if (event.nativeEvent.defaultPrevented)
                    return;
                if (disabled || readOnly || value === undefined)
                    return;

                const details = createChangeEventDetails(REASONS.none, event.nativeEvent);
                if (details.isCanceled)
                    return;

                setFieldTouched(true);
                setDirty(value !== validityData.initialValue);
                setFilled(true);
                setCheckedValue(value, details);
            }
        }),
        [
            checked,
            disabled,
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

    const refs = [ref, isInGroup ? registerControlRef : null, cardRef];
    const props = [rootProps, getDescriptionProps, groupValidation?.getValidationProps ?? EMPTY_OBJECT, elementProps];

    const element = useRenderElement('div', componentProps, {
        enabled: !isInGroup,
        state,
        ref: refs,
        props,
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <RadioCardRootContext.Provider value={contextValue}>
            {isInGroup
                ? (
                    <CompositeItem
                        tag={'div'}
                        render={render}
                        className={className}
                        state={state}
                        refs={refs}
                        props={props}
                        stateAttributesMapping={stateAttributesMapping}
                    />
                )
                : element}
            <input {...inputProps} />
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
