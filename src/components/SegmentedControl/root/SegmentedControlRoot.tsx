import React from 'react';

import { useControlledState, useMergedRef } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { useValueChanged } from '@flippo-ui/hooks/use-value-changed';

import { useHeadlessUiId } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';
import { NOOP } from '~@lib/noop';
import { visuallyHidden } from '~@lib/visuallyHidden';
import { contains } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, HTMLProps, Orientation } from '~@lib/types';

import { CompositeRoot } from '../../Composite/root/CompositeRoot';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { fieldValidityMapping } from '../../Field/utils/constants';
import { useFieldsetRootContext } from '../../Fieldset/root/FieldsetRootContext';
import { useFormContext } from '../../Form/FormContext';
import { useLabelableContext } from '../../LabelableProvider';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { SegmentedControlContext } from './SegmentedControlRootContext';
import { SegmentedControlRootDataAttributes } from './SegmentedControlRootDataAttributes';

import type { SegmentedControlContextValue } from './SegmentedControlRootContext';

const stateAttributesMapping = {
    disabled(value: boolean) {
        if (value) {
            return { [SegmentedControlRootDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    },
    readOnly(value: boolean) {
        if (value) {
            return { [SegmentedControlRootDataAttributes.readonly]: '' } as Record<string, string>;
        }
        return null;
    },
    ...fieldValidityMapping
};

/**
 * Provides a shared state to a series of mutually exclusive option buttons.
 * Renders a `<div>` element with role="radiogroup".
 *
 * Unlike ToggleGroup, a selected item cannot be deselected by clicking it again.
 *
 * @example
 * <SegmentedControl.Root defaultValue="week" onValueChange={setValue}>
 *   <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
 *   <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
 *   <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
 * </SegmentedControl.Root>
 */
export function SegmentedControlRoot(componentProps: SegmentedControlRoot.Props) {
    const {
        value: valueProp,
        defaultValue = null,
        onValueChange: onValueChangeProp,
        disabled: disabledProp,
        readOnly,
        required,
        orientation = 'horizontal',
        loopFocus = true,
        name: nameProp,
        inputRef: inputRefProp,
        id: idProp,
        render,
        className,
        ref,
        ...elementProps
    } = componentProps;

    const {
        setTouched: setFieldTouched,
        setFocused,
        shouldValidateOnChange,
        validationMode,
        name: fieldName,
        disabled: fieldDisabled,
        state: fieldState,
        validation,
        setDirty,
        setFilled,
        validityData
    } = useFieldRootContext();
    const { labelId } = useLabelableContext();
    const { clearErrors } = useFormContext();
    const fieldsetContext = useFieldsetRootContext(true);

    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;
    const id = useHeadlessUiId(idProp);

    const [value, setValueState] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue,
        caller: 'SegmentedControl'
    });

    const onValueChange = useStableCallback(onValueChangeProp ?? (() => {}));

    const setValue = useStableCallback(
        (nextValue: string, eventDetails: HeadlessUIChangeEventDetails<typeof REASONS.none>) => {
            if (nextValue === value || readOnly)
                return;
            onValueChange(nextValue, eventDetails);
            if (eventDetails.isCanceled)
                return;
            setValueState(nextValue);
        }
    );

    const controlRef = React.useRef<HTMLElement>(null);

    useField({
        id,
        commit: validation.commit,
        value: value ?? null,
        controlRef,
        name,
        getValue: () => value ?? null
    });

    useValueChanged(value, () => {
        clearErrors(name);
        setDirty(value !== validityData.initialValue);
        setFilled(value != null);

        if (shouldValidateOnChange()) {
            validation.commit(value);
        }
        else {
            validation.commit(value, true);
        }
    });

    const serializedValue = React.useMemo(() => {
        if (value == null)
            return '';
        return typeof value === 'string' ? value : JSON.stringify(value);
    }, [value]);

    const mergedInputRef = useMergedRef(validation.inputRef, inputRefProp);

    const inputProps = mergeProps<'input'>(
        {
            'value': serializedValue,
            'ref': mergedInputRef,
            id,
            'name': serializedValue ? name : undefined,
            disabled,
            readOnly,
            required,
            'aria-labelledby': elementProps['aria-labelledby'] ?? fieldsetContext?.legendId,
            'aria-hidden': true,
            'tabIndex': -1,
            'style': visuallyHidden,
            'onChange': NOOP,
            onFocus() {
                controlRef.current?.focus();
            }
        },
        validation.getInputValidationProps
    );

    const state: SegmentedControlRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            disabled: disabled ?? false,
            readOnly: readOnly ?? false,
            orientation
        }),
        [fieldState, disabled, readOnly, orientation]
    );

    const contextValue: SegmentedControlContextValue = React.useMemo(
        () => ({
            value: value ?? null,
            setValue,
            disabled: disabled ?? false,
            readOnly: readOnly ?? false,
            orientation
        }),
        [
            value,
            setValue,
            disabled,
            readOnly,
            orientation
        ]
    );

    const onBlur = useStableCallback((event: React.FocusEvent<HTMLElement>) => {
        if (!contains(event.currentTarget, event.relatedTarget)) {
            setFieldTouched(true);
            setFocused(false);

            if (validationMode === 'onBlur') {
                validation.commit(value);
            }
        }
    });

    const onKeyDownCapture = useStableCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key.startsWith('Arrow')) {
            setFieldTouched(true);
            setFocused(true);
        }
    });

    const defaultProps: HTMLProps = {
        'role': 'radiogroup',
        'aria-required': required || undefined,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-orientation': orientation,
        'aria-labelledby': labelId,
        onFocus() {
            setFocused(true);
        },
        onBlur,
        onKeyDownCapture
    };

    return (
        <SegmentedControlContext.Provider value={contextValue}>
            <CompositeRoot
                render={render}
                className={className}
                state={state}
                refs={[ref, controlRef]}
                props={[defaultProps, validation.getValidationProps, elementProps]}
                stateAttributesMapping={stateAttributesMapping}
                loopFocus={loopFocus}
            />
            <input {...inputProps} />
        </SegmentedControlContext.Provider>
    );
}

export type SegmentedControlRootState = {
    /** Whether the user should be unable to change the selected value. */
    readOnly: boolean;
    /** The orientation of the segmented control. */
    orientation: Orientation;
} & FieldRoot.State;

export type SegmentedControlRootProps = {
    /**
     * The controlled selected value.
     * Uncontrolled counterpart: `defaultValue`.
     */
    value?: string | null;
    /**
     * The initially selected value (uncontrolled).
     * @default null
     */
    defaultValue?: string | null;
    /**
     * Callback fired when the selected value changes.
     */
    onValueChange?: (value: string, eventDetails: SegmentedControlRoot.ChangeEventDetails) => void;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the selected value can be changed.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the user must select a value before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * The orientation of the component — controls arrow-key navigation direction.
     * @default 'horizontal'
     */
    orientation?: Orientation;
    /**
     * Whether keyboard focus loops back to the first item after the last.
     * @default true
     */
    loopFocus?: boolean;
    /**
     * Identifies the field when a form is submitted.
     */
    name?: string;
    /**
     * A ref to access the hidden input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * The id of the component.
     */
    id?: string;
} & HeadlessUIComponentProps<'div', SegmentedControlRoot.State>;

export type SegmentedControlRootChangeEventReason = typeof REASONS.none;
export type SegmentedControlRootChangeEventDetails
    = HeadlessUIChangeEventDetails<SegmentedControlRoot.ChangeEventReason>;

export namespace SegmentedControlRoot {
    export type State = SegmentedControlRootState;
    export type Props = SegmentedControlRootProps;
    export type ChangeEventReason = SegmentedControlRootChangeEventReason;
    export type ChangeEventDetails = SegmentedControlRootChangeEventDetails;
}
