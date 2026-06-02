import React from 'react';

import { useControlledState, useIsoLayoutEffect, useMergedRef } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { EMPTY_OBJECT } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { REASONS } from '~@lib/reason';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCheckboxGroupContext } from '../../CheckboxGroup/CheckboxGroupContext';
import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useFormContext } from '../../Form/FormContext';
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
 * A full-block checkbox option styled as a card.
 * The entire card surface is the interactive target.
 *
 * Works standalone OR within a CheckboxGroup.
 *
 * @example
 * // Standalone
 * <CheckboxCard.Root name="notifications" defaultChecked onCheckedChange={setChecked}>
 *   <CheckboxCard.Indicator />
 *   Enable notifications
 * </CheckboxCard.Root>
 *
 * @example
 * // Within CheckboxGroup
 * <CheckboxGroup value={values} onValueChange={setValues}>
 *   <CheckboxCard.Root value="emails">
 *     <CheckboxCard.Indicator />
 *     Email updates
 *   </CheckboxCard.Root>
 *   <CheckboxCard.Root value="sms">
 *     <CheckboxCard.Indicator />
 *     SMS alerts
 *   </CheckboxCard.Root>
 * </CheckboxGroup>
 */
export function CheckboxCardRoot(componentProps: CheckboxCardRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        checked: checkedProp,
        defaultChecked = false,
        disabled: disabledProp = false,
        indeterminate = false,
        required = false,
        value: valueProp,
        name: nameProp,
        inputRef: inputRefProp,
        onCheckedChange: onCheckedChangeProp,
        ref,
        ...elementProps
    } = componentProps;

    const { clearErrors } = useFormContext();
    const {
        disabled: fieldDisabled,
        name: fieldName,
        setDirty,
        setFilled,
        setFocused,
        setTouched,
        state: fieldState,
        validationMode,
        validityData,
        shouldValidateOnChange,
        validation: localValidation
    } = useFieldRootContext();
    const fieldItemContext = useFieldItemContext();
    const { labelId, getDescriptionProps } = useLabelableContext();

    const groupContext = useCheckboxGroupContext();

    const isInGroup = Boolean(groupContext);
    const groupDisabled = groupContext?.disabled ?? false;
    const disabled = fieldDisabled || fieldItemContext.disabled || groupDisabled || disabledProp;

    const validation = groupContext?.validation ?? localValidation;
    const name = fieldName ?? nameProp;

    // Derive checked from group context if present
    const groupChecked = isInGroup && valueProp !== undefined
        ? groupContext!.value?.includes(valueProp) ?? false
        : undefined;

    const [standaloneChecked, setStandaloneChecked] = useControlledState({
        prop: isInGroup ? undefined : checkedProp,
        defaultProp: isInGroup ? undefined : defaultChecked,
        caller: 'CheckboxCard'
    });

    const checked = isInGroup ? (groupChecked ?? false) : (standaloneChecked ?? false);

    const onCheckedChange = useStableCallback(onCheckedChangeProp ?? (() => {}));

    const fieldId = useHeadlessUiId();

    const cardRef = React.useRef<HTMLElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRef(inputRefProp, inputRef, validation.inputRef);

    useField({
        enabled: !isInGroup,
        id: fieldId,
        commit: validation.commit,
        value: checked,
        controlRef: cardRef,
        name,
        getValue: () => checked
    });

    useIsoLayoutEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
            if (checked) {
                setFilled(true);
            }
        }
    }, [checked, indeterminate, setFilled]);

    useValueChanged(checked, () => {
        if (isInGroup)
            return;

        clearErrors(name);
        setFilled(checked);
        setDirty(checked !== validityData.initialValue);

        if (shouldValidateOnChange()) {
            validation.commit(checked);
        }
        else {
            validation.commit(checked, true);
        }
    });

    const state: CheckboxCardRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            checked,
            disabled: disabled ?? false,
            indeterminate,
            required
        }),
        [
            fieldState,
            checked,
            disabled,
            indeterminate,
            required
        ]
    );

    const contextValue = state;

    const rootProps = {
        'role': 'checkbox',
        'aria-checked': indeterminate ? ('mixed' as const) : checked,
        'aria-disabled': disabled || undefined,
        'aria-required': required || undefined,
        'aria-labelledby': labelId,
        'tabIndex': disabled ? -1 : 0,
        onKeyDown(event: React.KeyboardEvent) {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                inputRef.current?.click();
            }
        },
        onClick(event: React.MouseEvent) {
            if (event.defaultPrevented || disabled)
                return;
            event.preventDefault();
            inputRef.current?.click();
        },
        onFocus() {
            setFocused(true);
        },
        onBlur() {
            setTouched(true);
            setFocused(false);

            if (validationMode === 'onBlur') {
                const valueForValidation = isInGroup ? groupContext!.value : checked;
                validation.commit(valueForValidation);
            }
        }
    };

    const inputProps = mergeProps<'input'>(
        {
            'type': 'checkbox',
            'ref': mergedInputRef,
            'tabIndex': -1,
            'style': visuallyHidden,
            'aria-hidden': true,
            checked,
            disabled,
            required,
            'name': isInGroup ? undefined : name,
            onChange(event: React.ChangeEvent<HTMLInputElement>) {
                if (event.nativeEvent.defaultPrevented)
                    return;

                const nextChecked = event.target.checked;
                const details = createChangeEventDetails(REASONS.none, event.nativeEvent);

                if (isInGroup && valueProp !== undefined && groupContext) {
                    const currentValues = groupContext.value ?? [];
                    const nextValues = nextChecked
                        ? [...currentValues, valueProp]
                        : currentValues.filter((v) => v !== valueProp);

                    groupContext.setValue(nextValues, details);
                }
                else {
                    onCheckedChange(nextChecked, details);
                    if (!details.isCanceled) {
                        setStandaloneChecked(nextChecked);
                    }
                }
            },
            onFocus() {
                cardRef.current?.focus();
            }
        },
        valueProp !== undefined
            ? { value: (isInGroup ? checked && valueProp : valueProp) || '' }
            : EMPTY_OBJECT,
        getDescriptionProps,
        isInGroup ? validation.getValidationProps : validation.getInputValidationProps
    );

    const refs = [ref, isInGroup ? groupContext!.registerControlRef : null, cardRef];
    const props = [rootProps, elementProps];

    const element = useRenderElement('div', componentProps, {
        state,
        ref: refs,
        props,
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <CheckboxCardRootContext.Provider value={contextValue}>
            {element}
            {!checked && !isInGroup && name && (
                <input type={'hidden'} name={name} value={'off'} />
            )}
            <input {...inputProps} />
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
