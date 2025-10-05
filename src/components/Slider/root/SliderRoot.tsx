import React from 'react';

import {
    useControlledState,
    useEventCallback,
    useIsoLayoutEffect,
    useLatestRef
} from '@flippo-ui/hooks';
import { areArraysEqual } from '~@lib/areArraysEqual';
import { clamp } from '~@lib/clamp';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { ownerDocument } from '~@lib/owner';
import { warn } from '~@lib/warn';
import { activeElement } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useFieldControlValidation } from '../../Field/control/useFieldControlValidation';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useField } from '../../Field/useField';
import { useFormContext } from '../../Form/FormContext';
import { asc } from '../utils/asc';
import { getSliderValue } from '../utils/getSliderValue';
import { validateMinimumDistance } from '../utils/validateMinimumDistance';

import type { CompositeMetadata } from '../../Composite/list/CompositeList';
import type { FieldRoot } from '../../Field/root/FieldRoot';
import type { ThumbMetadata } from '../thumb/SliderThumb';

import { SliderRootContext } from './SliderRootContext';
import { sliderStyleHookMapping } from './styleHooks';

import type { SliderRootContextValue } from './SliderRootContext';

function areValuesEqual(
    newValue: number | readonly number[],
    oldValue: number | readonly number[]
) {
    if (typeof newValue === 'number' && typeof oldValue === 'number') {
        return newValue === oldValue;
    }
    if (Array.isArray(newValue) && Array.isArray(oldValue)) {
        return areArraysEqual(newValue, oldValue);
    }
    return false;
}

/**
 * Groups all parts of the slider.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Slider](https://base-ui.com/react/components/slider)
 */
export function SliderRoot<
    Value extends number | readonly number[],
>(componentProps: SliderRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        'aria-labelledby': ariaLabelledbyProp,
        defaultValue,
        disabled: disabledProp = false,
        id: idProp,
        format,
        largeStep = 10,
        locale,
        max = 100,
        min = 0,
        minStepsBetweenValues = 0,
        name: nameProp,
        onValueChange: onValueChangeProp,
        onValueCommitted: onValueCommittedProp,
        orientation = 'horizontal',
        step = 1,
        tabIndex: externalTabIndex,
        value: valueProp,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp);
    const onValueChange = useEventCallback(
        onValueChangeProp as (
            value: number | number[],
            data: HeadlessUIChangeEventDetails<'none'>,
            activeThumbIndex: number,
        ) => void
    );
    const onValueCommitted = useEventCallback(
        onValueCommittedProp as (value: number | readonly number[], data: HeadlessUIChangeEventDetails<'none'>,) => void
    );

    const { clearErrors } = useFormContext();
    const {
        labelId,
        state: fieldState,
        disabled: fieldDisabled,
        name: fieldName,
        setTouched,
        setDirty,
        validityData,
        validationMode
    } = useFieldRootContext();

    const fieldControlValidation = useFieldControlValidation();

    const ariaLabelledby = ariaLabelledbyProp ?? labelId;
    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp ?? '';

    // The internal value is potentially unsorted, e.g. to support frozen arrays
    // https://github.com/mui/material-ui/pull/28472
    const [valueUnwrapped, setValueUnwrapped] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue ?? min,
        caller: 'Slider'
    });

    const sliderRef = React.useRef<HTMLElement>(null);
    const controlRef = React.useRef<HTMLElement>(null);
    const thumbRefs = React.useRef<(HTMLElement | null)[]>([]);
    // The input element nested in the pressed thumb.
    const pressedInputRef = React.useRef<HTMLInputElement>(null);
    // The px distance between the pointer and the center of a pressed thumb.
    const pressedThumbCenterOffsetRef = React.useRef<number | null>(null);
    // The index of the pressed thumb, or the closest thumb if the `Control` was pressed.
    // This is updated on pointerdown, which is sooner than the `active/activeIndex`
    // state which is updated later when the nested `input` receives focus.
    const pressedThumbIndexRef = React.useRef(-1);
    const lastChangedValueRef = React.useRef<number | readonly number[] | null>(null);
    const formatOptionsRef = useLatestRef(format);

    // We can't use the :active browser pseudo-classes.
    // - The active state isn't triggered when clicking on the rail.
    // - The active state isn't transferred when inversing a range slider.
    const [active, setActive] = React.useState(-1);
    const [dragging, setDragging] = React.useState(false);
    const [thumbMap, setThumbMap] = React.useState(
        () => new Map<Node, CompositeMetadata<ThumbMetadata> | null>()
    );

    useField({
        id,
        commitValidation: fieldControlValidation.commitValidation,
        value: valueUnwrapped,
        controlRef,
        name,
        getValue: () => valueUnwrapped
    });

    const registerFieldControlRef = useEventCallback((element: HTMLElement | null) => {
        if (element) {
            controlRef.current = element;
        }
    });

    const range = Array.isArray(valueUnwrapped);

    const values = React.useMemo(() => {
        if (!range) {
            return [clamp(valueUnwrapped as number, min, max)];
        }
        return valueUnwrapped.slice().sort(asc);
    }, [
        max,
        min,
        range,
        valueUnwrapped
    ]);

    const setValue = useEventCallback(
        (newValue: number | number[], thumbIndex: number, event: Event) => {
            if (Number.isNaN(newValue) || areValuesEqual(newValue, valueUnwrapped)) {
                return;
            }

            setValueUnwrapped(newValue as Value);
            // Redefine target to allow name and value to be read.
            // This allows seamless integration with the most popular form libraries.
            // https://github.com/mui/material-ui/issues/13485#issuecomment-676048492
            // Clone the event to not override `target` of the original event.
            // @ts-expect-error The nativeEvent is function, not object
            const clonedEvent = new event.constructor(event.type, event);

            Object.defineProperty(clonedEvent, 'target', {
                writable: true,
                value: { value: newValue, name }
            });

            lastChangedValueRef.current = newValue;

            const details = createChangeEventDetails('none', clonedEvent);

            onValueChange(newValue, details, thumbIndex);

            if (details.isCanceled) {
                return;
            }

            setValueUnwrapped(newValue as Value);
            clearErrors(name);
            fieldControlValidation.commitValidation(newValue, true);

            onValueChange(newValue, clonedEvent, thumbIndex);
            clearErrors(name);
            fieldControlValidation.commitValidation(newValue, true);
        }
    );

    // for keypresses only
    const handleInputChange = useEventCallback(
        (valueInput: number, index: number, event: React.KeyboardEvent | React.ChangeEvent) => {
            const newValue = getSliderValue(valueInput, index, min, max, range, values);

            if (validateMinimumDistance(newValue, step, minStepsBetweenValues)) {
                setValue(newValue, index, event.nativeEvent);
                setDirty(newValue !== validityData.initialValue);
                setTouched(true);

                const nextValue = lastChangedValueRef.current ?? newValue;
                onValueCommitted(nextValue, createChangeEventDetails('none', event.nativeEvent));
                clearErrors(name);

                if (validationMode === 'onChange') {
                    fieldControlValidation.commitValidation(nextValue ?? newValue);
                }
                else {
                    fieldControlValidation.commitValidation(nextValue ?? newValue, true);
                }
            }
        }
    );

    useIsoLayoutEffect(() => {
        if (valueProp === undefined || dragging) {
            return;
        }

        if (min >= max) {
            warn('Slider `max` must be greater than `min`');
        }
    }, [
        dragging,
        min,
        max,
        valueProp
    ]);

    useIsoLayoutEffect(() => {
        const activeEl = activeElement(ownerDocument(sliderRef.current));
        if (disabled && activeEl && sliderRef.current?.contains(activeEl)) {
            // This is necessary because Firefox and Safari will keep focus
            // on a disabled element:
            // https://codesandbox.io/p/sandbox/mui-pr-22247-forked-h151h?file=/src/App.js
            (activeEl as HTMLElement).blur();
        }
    }, [disabled]);

    if (disabled && active !== -1) {
        setActive(-1);
    }

    const state: SliderRoot.State = React.useMemo(
        () => ({
            ...fieldState,
            activeThumbIndex: active,
            disabled,
            dragging,
            orientation,
            max,
            min,
            minStepsBetweenValues,
            step,
            values
        }),
        [
            fieldState,
            active,
            disabled,
            dragging,
            max,
            min,
            minStepsBetweenValues,
            orientation,
            step,
            values
        ]
    );

    const contextValue: SliderRootContextValue = React.useMemo(
        () => ({
            name,
            active,
            disabled,
            dragging,
            fieldControlValidation,
            formatOptionsRef,
            handleInputChange,
            pressedInputRef,
            pressedThumbCenterOffsetRef,
            pressedThumbIndexRef,
            labelId: ariaLabelledby,
            largeStep,
            lastChangedValueRef,
            locale,
            max,
            min,
            minStepsBetweenValues,
            onValueCommitted,
            orientation,
            range,
            registerFieldControlRef,
            setActive,
            setDragging,
            setValue,
            state,
            step,
            tabIndex: externalTabIndex ?? null,
            thumbMap,
            thumbRefs,
            values
        }),
        [
            active,
            ariaLabelledby,
            disabled,
            dragging,
            pressedInputRef,
            pressedThumbCenterOffsetRef,
            pressedThumbIndexRef,
            externalTabIndex,
            fieldControlValidation,
            formatOptionsRef,
            handleInputChange,
            largeStep,
            locale,
            max,
            min,
            minStepsBetweenValues,
            name,
            onValueCommitted,
            orientation,
            range,
            registerFieldControlRef,
            setValue,
            state,
            step,
            thumbMap,
            values
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, sliderRef],
        props: [{
            'aria-labelledby': ariaLabelledby,
            id,
            'role': 'group'
        }, fieldControlValidation.getValidationProps, elementProps],
        customStyleHookMapping: sliderStyleHookMapping
    });

    return (
        <SliderRootContext value={contextValue}>
            <CompositeList elementsRef={thumbRefs} onMapChange={setThumbMap}>
                {element}
            </CompositeList>
        </SliderRootContext>
    );
}

export namespace SliderRoot {
    export type ChangeEventReason = 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;

    export type State = {
    /**
     * The index of the active thumb.
     */
        activeThumbIndex: number;
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
        /**
         * Whether the thumb is currently being dragged.
         */
        dragging: boolean;
        max: number;
        min: number;
        /**
         * The minimum steps between values in a range slider.
         * @default 0
         */
        minStepsBetweenValues: number;
        /**
         * The component orientation.
         */
        orientation: Orientation;
        /**
         * The step increment of the slider when incrementing or decrementing. It will snap
         * to multiples of this value. Decimal values are supported.
         * @default 1
         */
        step: number;
        /**
         * The raw number value of the slider.
         */
        values: readonly number[];
    } & FieldRoot.State;

    export type Props<Value extends number | readonly number[] = number | readonly number[]> = {
    /**
     * The uncontrolled value of the slider when it’s initially rendered.
     *
     * To render a controlled slider, use the `value` prop instead.
     */
        defaultValue?: Value;
        /**
         * Whether the slider should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
        /**
         * Options to format the input value.
         */
        format?: Intl.NumberFormatOptions;
        /**
         * The locale used by `Intl.NumberFormat` when formatting the value.
         * Defaults to the user's runtime locale.
         */
        locale?: Intl.LocalesArgument;
        /**
         * The maximum allowed value of the slider.
         * Should not be equal to min.
         * @default 100
         */
        max?: number;
        /**
         * The minimum allowed value of the slider.
         * Should not be equal to max.
         * @default 0
         */
        min?: number;
        /**
         * The minimum steps between values in a range slider.
         * @default 0
         */
        minStepsBetweenValues?: number;
        /**
         * Identifies the field when a form is submitted.
         */
        name?: string;
        /**
         * The component orientation.
         * @default 'horizontal'
         */
        orientation?: Orientation;
        /**
         * The granularity with which the slider can step through values. (A "discrete" slider.)
         * The `min` prop serves as the origin for the valid values.
         * We recommend (max - min) to be evenly divisible by the step.
         * @default 1
         */
        step?: number;
        /**
         * The granularity with which the slider can step through values when using Page Up/Page Down or Shift + Arrow Up/Arrow Down.
         * @default 10
         */
        largeStep?: number;
        /**
         * Optional tab index attribute for the thumb components.
         */
        tabIndex?: number;
        /**
         * The value of the slider.
         * For ranged sliders, provide an array with two values.
         */
        value?: Value;
        /**
         * Callback function that is fired when the slider's value changed.
         *
         * @param {number | number[]} value The new value.
         * @param {Event} event The corresponding event that initiated the change.
         * You can pull out the new value by accessing `event.target.value` (any).
         * @param {number} activeThumbIndex Index of the currently moved thumb.
         */
        onValueChange?: (
            value: Value extends number ? number : Value,
            eventDetails: ChangeEventDetails,
            activeThumbIndex: number,
        ) => void;
        /**
         * Callback function that is fired when the `pointerup` is triggered.
         *
         * @param {number | number[]} value The new value.
         * @param {Event} event The corresponding event that initiated the change.
         * **Warning**: This is a generic event not a change event.
         */
        onValueCommitted?: (value: Value extends number ? number : Value, eventDetails: ChangeEventDetails,
        ) => void;
    } & HeadlessUIComponentProps<'div', State>;
}
