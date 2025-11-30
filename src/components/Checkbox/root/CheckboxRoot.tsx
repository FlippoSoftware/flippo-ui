import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useMergedRef
} from '@flippo-ui/hooks';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useCheckboxGroupContext } from '../../CheckboxGroup/CheckboxGroupContext';
import { useFieldControlValidation } from '../../Field/control/useFieldControlValidation';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { useFormContext } from '../../Form/FormContext';
import { useButton } from '../../use-button';
import { useCustomStyleHookMapping } from '../utils/useCustomStyleHookMapping';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { CheckboxRootContext } from './CheckboxRootContext';

const EMPTY = {};
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
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
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
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { clearErrors } = useFormContext();
    const {
        disabled: fieldDisabled,
        labelId,
        name: fieldName,
        setControlId,
        setDirty,
        setFilled,
        setFocused,
        setTouched,
        state: fieldState,
        validationMode,
        validityData
    } = useFieldRootContext();

    const groupContext = useCheckboxGroupContext();
    const parentContext = groupContext?.parent;
    const isGrouped = parentContext && groupContext.allValues;

    const disabled = fieldDisabled || groupContext?.disabled || disabledProp;
    const name = fieldName ?? nameProp;
    const value = valueProp ?? name;

    let groupProps: Partial<Omit<CheckboxRoot.Props, 'className'>> = {};
    if (isGrouped) {
        if (parent) {
            groupProps = groupContext.parent.getParentProps();
        }
        else if (value) {
            groupProps = groupContext.parent.getChildProps(value);
        }
    }

    const onCheckedChange = useEventCallback(onCheckedChangeProp);

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

    const localFieldControlValidation = useFieldControlValidation();
    const fieldControlValidation
        = groupContext?.fieldControlValidation ?? localFieldControlValidation;

    const [checked, setCheckedState] = useControlledState({
        prop: value && groupValue && !parent ? groupValue.includes(value) : groupChecked,
        defaultProp:
            value && defaultGroupValue && !parent ? defaultGroupValue.includes(value) : defaultChecked,
        caller: 'Checkbox'
    });

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        const element = controlRef?.current;
        if (!element) {
            return undefined;
        }

        if (groupContext) {
            setControlId(idProp ?? null);
        }
        else if (element.closest('label') == null) {
            setControlId(id);
        }

        return () => {
            setControlId(undefined);
        };
    }, [groupContext, id, idProp, setControlId]);

    useField({
        enabled: !groupContext,
        id,
        commitValidation: fieldControlValidation.commitValidation,
        value: checked,
        controlRef,
        name,
        getValue: () => checked
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRef(inputRefProp, inputRef, fieldControlValidation.inputRef);

    useIsoLayoutEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = groupIndeterminate;
            if (checked) {
                setFilled(true);
            }
        }
    }, [checked, groupIndeterminate, setFilled]);

    const onFocus = useEventCallback(() => setFocused(true));

    const onBlur = useEventCallback(() => {
        const element = inputRef.current;
        if (!element) {
            return;
        }

        setTouched(true);
        setFocused(false);

        if (validationMode === 'onBlur') {
            fieldControlValidation.commitValidation(groupContext ? groupValue : element.checked);
        }
    });

    const onClick = useEventCallback((event) => {
        if (event.defaultPrevented || readOnly) {
            return;
        }

        event.preventDefault();

        inputRef.current?.click();
    });

    const inputProps = mergeProps<'input'>(
        {
            checked,
            disabled,
            // parent checkboxes unset `name` to be excluded from form submission
            'name': parent ? undefined : name,
            // Set `id` to stop Chrome warning about an unassociated input
            'id': `${id}-input`,
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
                const details = createChangeEventDetails('none', event.nativeEvent);

                groupOnChange?.(nextChecked, details);
                onCheckedChange(nextChecked, details);

                if (details.isCanceled) {
                    return;
                }

                clearErrors(name);
                setDirty(nextChecked !== validityData.initialValue);
                setCheckedState(nextChecked);

                if (!groupContext) {
                    setFilled(nextChecked);

                    if (validationMode === 'onChange') {
                        fieldControlValidation.commitValidation(nextChecked);
                    }
                    else {
                        fieldControlValidation.commitValidation(nextChecked, true);
                    }
                }

                if (value && groupValue && setGroupValue && !parent) {
                    const nextGroupValue = nextChecked
                        ? [...groupValue, value]
                        : groupValue.filter((item) => item !== value);

                    setGroupValue(nextGroupValue, details);
                    setFilled(nextGroupValue.length > 0);

                    if (validationMode === 'onChange') {
                        fieldControlValidation.commitValidation(nextGroupValue);
                    }
                    else {
                        fieldControlValidation.commitValidation(nextGroupValue, true);
                    }
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
            : EMPTY,
        groupContext
            ? fieldControlValidation.getValidationProps
            : fieldControlValidation.getInputValidationProps
    );

    const computedChecked = isGrouped ? Boolean(groupChecked) : checked;
    const computedIndeterminate = isGrouped ? groupIndeterminate || indeterminate : indeterminate;

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

    const customStyleHookMapping = useCustomStyleHookMapping(state);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [buttonRef, controlRef, ref, groupContext?.registerControlRef],
        props: [
            {
                id,
                'role': 'checkbox',
                disabled,
                'aria-checked': groupIndeterminate ? 'mixed' : checked,
                'aria-readonly': readOnly || undefined,
                'aria-required': required || undefined,
                'aria-labelledby': labelId,
                [PARENT_CHECKBOX as string]: parent ? '' : undefined,
                onFocus,
                onBlur,
                onClick
            },
            fieldControlValidation.getValidationProps,
            elementProps,
            otherGroupProps,
            getButtonProps
        ],
        customStyleHookMapping
    });

    return (
        <CheckboxRootContext value={state}>
            {element}
            {!checked && !groupContext && componentProps.name && !parent && (
                <input type={'hidden'} name={componentProps.name} value={'off'} />
            )}
            <input {...inputProps} />
        </CheckboxRootContext>
    );
}

export namespace CheckboxRoot {
    export type State = {
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

    export type Props = {
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
         *
         * @param {boolean} checked The new checked state.
         * @param {Event} event The corresponding event that initiated the change.
         */
        onCheckedChange?: (checked: boolean, eventDetails: ChangeEventDetails) => void;
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
    } & NativeButtonProps & Omit<HeadlessUIComponentProps<'button', State>, 'onChange' | 'value'>;

    export type ChangeEventReason = 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
