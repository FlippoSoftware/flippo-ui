import React from 'react';

import {
    useControlledState,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { EMPTY_OBJECT } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { NOOP } from '~@lib/noop';
import { REASONS } from '~@lib/reason';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useCheckboxGroupContext } from '../../CheckboxGroup/CheckboxGroupContext';
import { useFieldItemContext } from '../../Field/item/FieldItemContext';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { useFormContext } from '../../Form/FormContext';
import { useLabelableContext } from '../../LabelableProvider';
import { useButton } from '../../use-button';
import { useStateAttributesMapping } from '../utils/useStateAttributesMapping';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { CheckboxRootContext } from './CheckboxRootContext';

export const PARENT_CHECKBOX = 'data-parent';

/**
 * Represents the checkbox itself.
 * Renders a `<button>` element and a hidden `<input>` beside.
 *
 * Documentation: [Base UI Checkbox](https://base-ui.com/react/components/checkbox)
 */
export function CheckboxRoot(componentProps: CheckboxRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        checked: checkedProp,
        defaultChecked = false,
        disabled: disabledProp = false,
        id: idProp,
        indeterminate = false,
        inputRef: inputRefProp,
        name: nameProp,
        onCheckedChange: onCheckedChangeProp,
        parent = false,
        readOnly = false,
        required = false,
        value: valueProp,
        nativeButton = false,
        ...elementProps
    } = componentProps;

    const { clearErrors } = useFormContext();
    const {
        disabled: rootDisabled,
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
    const {
        labelId,
        controlId,
        setControlId,
        getDescriptionProps
    } = useLabelableContext();

    const groupContext = useCheckboxGroupContext();
    const parentContext = groupContext?.parent;
    const isGroupedWithParent = parentContext && groupContext.allValues;

    const disabled
        = rootDisabled || fieldItemContext.disabled || groupContext?.disabled || disabledProp;
    const name = fieldName ?? nameProp;
    const value = valueProp ?? name;

    const id = useHeadlessUiId();

    const parentId = useHeadlessUiId();
    let inputId = controlId;
    if (isGroupedWithParent) {
        inputId = parent ? parentId : `${parentContext.id}-${value}`;
    }
    else if (idProp) {
        inputId = idProp;
    }

    let groupProps: Partial<Omit<CheckboxRoot.Props, 'className'>> = {};
    if (isGroupedWithParent) {
        if (parent) {
            groupProps = groupContext.parent.getParentProps();
        }
        else if (value) {
            groupProps = groupContext.parent.getChildProps(value);
        }
    }

    const onCheckedChange = useStableCallback(onCheckedChangeProp);

    const {
        checked: groupChecked = checkedProp,
        indeterminate: groupIndeterminate = indeterminate,
        onCheckedChange: groupOnChange,
        ...otherGroupProps
    } = groupProps;

    const groupValue = groupContext?.value;
    const setGroupValue = groupContext?.setValue;
    const defaultGroupValue = groupContext?.defaultValue;

    const controlRef = React.useRef<HTMLButtonElement>(null);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const validation = groupContext?.validation ?? localValidation;

    const [checked, setCheckedState] = useControlledState({
        prop: value && groupValue && !parent ? groupValue.includes(value) : groupChecked,
        defaultProp:
            value && defaultGroupValue && !parent ? defaultGroupValue.includes(value) : defaultChecked,
        caller: 'Checkbox'
    });

    // can't use useLabelableId because of optional groupContext and/or parent
    useIsoLayoutEffect(() => {
        if (setControlId === NOOP) {
            return undefined;
        }

        setControlId(inputId);

        return () => {
            setControlId(undefined);
        };
    }, [inputId, groupContext, setControlId, parent]);

    useField({
        enabled: !groupContext,
        id,
        commit: validation.commit,
        value: checked,
        controlRef,
        name,
        getValue: () => checked
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRef(inputRefProp, inputRef, validation.inputRef);

    useIsoLayoutEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = groupIndeterminate;
            if (checked) {
                setFilled(true);
            }
        }
    }, [checked, groupIndeterminate, setFilled]);

    useValueChanged(checked, () => {
        if (groupContext && !parent) {
            return;
        }

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

    const inputProps = mergeProps<'input'>(
        {
            checked,
            disabled,
            // parent checkboxes unset `name` to be excluded from form submission
            'name': parent ? undefined : name,
            // Set `id` to stop Chrome warning about an unassociated input
            'id': inputId ?? undefined,
            required,
            'ref': mergedInputRef,
            'style': visuallyHidden,
            'tabIndex': -1,
            'type': 'checkbox',
            'aria-hidden': true,
            onChange(event) {
                // Workaround for https://github.com/facebook/react/issues/9023
                if (event.nativeEvent.defaultPrevented) {
                    return;
                }

                const nextChecked = event.target.checked;
                const details = createChangeEventDetails(REASONS.none, event.nativeEvent);

                groupOnChange?.(nextChecked, details);
                onCheckedChange(nextChecked, details);

                if (details.isCanceled) {
                    return;
                }

                setCheckedState(nextChecked);

                if (value && groupValue && setGroupValue && !parent) {
                    const nextGroupValue = nextChecked
                        ? [...groupValue, value]
                        : groupValue.filter((item) => item !== value);

                    setGroupValue(nextGroupValue, details);
                }
            },
            onFocus() {
                controlRef.current?.focus();
            }
        },
        // React <19 sets an empty value if `undefined` is passed explicitly
        // To avoid this, we only set the value if it's defined
        valueProp !== undefined
            ? { value: (groupContext ? checked && valueProp : valueProp) || '' }
            : EMPTY_OBJECT,
        getDescriptionProps,
        groupContext ? validation.getValidationProps : validation.getInputValidationProps
    );

    const computedChecked = isGroupedWithParent ? Boolean(groupChecked) : checked;
    const computedIndeterminate = isGroupedWithParent
        ? groupIndeterminate || indeterminate
        : indeterminate;

    React.useEffect(() => {
        if (parentContext && value) {
            parentContext.disabledStatesRef.current.set(value, disabled);
        }
    }, [parentContext, disabled, value]);

    const state: CheckboxRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            checked: computedChecked,
            disabled,
            readOnly,
            required,
            indeterminate: computedIndeterminate
        }),
        [
            fieldState,
            computedChecked,
            disabled,
            readOnly,
            required,
            computedIndeterminate
        ]
    );

    const stateAttributesMapping = useStateAttributesMapping(state);

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [buttonRef, controlRef, ref, groupContext?.registerControlRef],
        props: [
            {
                id,
                'role': 'checkbox',
                'aria-checked': groupIndeterminate ? 'mixed' : checked,
                'aria-readonly': readOnly || undefined,
                'aria-required': required || undefined,
                'aria-labelledby': labelId,
                [PARENT_CHECKBOX as string]: parent ? '' : undefined,
                onFocus() {
                    setFocused(true);
                },
                onBlur() {
                    const inputEl = inputRef.current;
                    if (!inputEl) {
                        return;
                    }

                    setTouched(true);
                    setFocused(false);

                    if (validationMode === 'onBlur') {
                        validation.commit(groupContext ? groupValue : inputEl.checked);
                    }
                },
                onClick(event: React.MouseEvent) {
                    if (readOnly || disabled) {
                        return;
                    }

                    event.preventDefault();

                    inputRef.current?.click();
                }
            },
            getDescriptionProps,
            validation.getValidationProps,
            elementProps,
            otherGroupProps,
            getButtonProps
        ],
        customStyleHookMapping: stateAttributesMapping
    });

    return (
        <CheckboxRootContext.Provider value={state}>
            {element}
            {!checked && !groupContext && name && !parent && (
                <input type={'hidden'} name={name} value={'off'} />
            )}
            <input {...inputProps} />
        </CheckboxRootContext.Provider>
    );
}

export type CheckboxRootState = {
    /**
     * Whether the checkbox is currently ticked.
     */
    checked: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the user should be unable to tick or untick the checkbox.
     */
    readOnly: boolean;
    /**
     * Whether the user must tick the checkbox before submitting a form.
     */
    required: boolean;
    /**
     * Whether the checkbox is in a mixed state: neither ticked, nor unticked.
     */
    indeterminate: boolean;
} & FieldRoot.State;

export type CheckboxRootProps = {
    /**
     * The id of the input element.
     */
    id?: string;
    /**
     * Identifies the field when a form is submitted.
     * @default undefined
     */
    name?: string;
    /**
     * Whether the checkbox is currently ticked.
     *
     * To render an uncontrolled checkbox, use the `defaultChecked` prop instead.
     * @default undefined
     */
    checked?: boolean;
    /**
     * Whether the checkbox is initially ticked.
     *
     * To render a controlled checkbox, use the `checked` prop instead.
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Event handler called when the checkbox is ticked or unticked.
     */
    onCheckedChange?: (checked: boolean, eventDetails: CheckboxRootChangeEventDetails) => void;
    /**
     * Whether the user should be unable to tick or untick the checkbox.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the user must tick the checkbox before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * Whether the checkbox is in a mixed state: neither ticked, nor unticked.
     * @default false
     */
    indeterminate?: boolean;
    /**
     * A ref to access the hidden `<input>` element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * Whether the checkbox controls a group of child checkboxes.
     *
     * Must be used in a [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
     * @default false
     */
    parent?: boolean;
    /**
     * The value of the selected checkbox.
     */
    value?: string;
} & NonNativeButtonProps & Omit<HeadlessUIComponentProps<'span', CheckboxRoot.State>, 'onChange' | 'value'>;

export type CheckboxRootChangeEventReason = typeof REASONS.none;
export type CheckboxRootChangeEventDetails
    = HeadlessUIChangeEventDetails<CheckboxRoot.ChangeEventReason>;

export namespace CheckboxRoot {
    export type State = CheckboxRootState;
    export type Props = CheckboxRootProps;
    export type ChangeEventReason = CheckboxRootChangeEventReason;
    export type ChangeEventDetails = CheckboxRootChangeEventDetails;
}
