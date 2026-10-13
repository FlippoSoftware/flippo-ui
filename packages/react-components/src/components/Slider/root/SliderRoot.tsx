import React from 'react';

import { SliderMachine } from '@flippo-software/core-components/slider';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import type { SliderOptions } from '@flippo-software/core-components/slider';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useDirection, useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails, HeadlessUIGenericEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';
import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useLabelableContext } from '../../LabelableProvider';

import type { FieldRoot } from '../../Field/root/FieldRoot';

import { SliderRootContext } from './SliderRootContext';
import { sliderStyleHookMapping } from './styleHooks';

/**
 * Groups all parts of the slider.
 * Renders a `<div>` element.
 */
export function SliderRoot<Value extends number | readonly number[]>(componentProps: SliderRoot.Props<Value>) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        'aria-labelledby': ariaLabelledBy,
        defaultValue,
        disabled,
        id: idProp,
        format,
        largeStep = 10,
        locale,
        max = 100,
        min = 0,
        minStepsBetweenValues = 0,
        name,
        onValueChange,
        onValueCommitted,
        orientation = 'horizontal',
        step = 1,
        thumbCollisionBehavior = 'push',
        thumbAlignment = 'center',
        value,
        ref,
        ...elementProps
    } = componentProps;

    const { field } = useFieldRootContext();
    const { labelable } = useLabelableContext();
    const direction = useDirection();

    const id = useHeadlessUiId(idProp) as string;

    const slider = useMachine((options) => new SliderMachine(options), {
        id,
        'aria-labelledby': ariaLabelledBy,
        defaultValue: defaultValue as SliderOptions['defaultValue'],
        value: value as SliderOptions['value'],
        disabled,
        format,
        locale,
        largeStep,
        max,
        min,
        minStepsBetweenValues,
        name,
        orientation,
        step,
        thumbCollisionBehavior,
        thumbAlignment,
        onValueChange: onValueChange as SliderOptions['onValueChange'],
        onValueCommitted: onValueCommitted as SliderOptions['onValueCommitted'],
        field,
        labelable,
        direction
    });
    const track = useTracker();
    const state = track(() => slider.getState()) as SliderRoot.State;

    // Registered again after each render: the registration holds the current value and validity.
    useIsoLayoutEffect(() => slider.registerField());

    // Not memoized: the state also follows props, and the parts render with the root anyway.
    const contextValue = { slider, state };

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, slider.setSliderElement],
        props: [elementProps, (props) => track(() => toReactProps(slider.getRootProps(props)))],
        customStyleHookMapping: sliderStyleHookMapping
    });

    return (
        <SliderRootContext.Provider value={contextValue}>
            <CompositeList
                registry={slider.thumbRegistry as never}
                elementsRef={slider.thumbRegistry.elementsRef as React.RefObject<Array<HTMLElement | null>>}
            >
                {element}
            </CompositeList>
        </SliderRootContext.Provider>
    );
}

export type SliderRootState = {
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

export type SliderRootProps<Value extends number | readonly number[] = number | readonly number[]> = {
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
     * How the thumb(s) are aligned relative to `Slider.Control` when the value is at `min` or `max`:
     * - `center`: The center of the thumb is aligned with the control edge
     * - `edge`: The thumb is inset within the control such that its edge is aligned with the control edge
     * - `edge-client-only`: Same as `edge` but renders after React hydration on the client, reducing bundle size in return
     * @default 'center'
     */
    thumbAlignment?: 'center' | 'edge' | 'edge-client-only';
    /**
     * Controls how thumbs behave when they collide during pointer interactions.
     *
     * - `'push'` (default): Thumbs push each other without restoring their previous positions when dragged back.
     * - `'swap'`: Thumbs swap places when dragged past each other.
     * - `'none'`: Thumbs cannot move past each other; excess movement is ignored.
     *
     * @default 'push'
     */
    thumbCollisionBehavior?: 'push' | 'swap' | 'none';
    /**
     * The value of the slider.
     * For ranged sliders, provide an array with two values.
     */
    value?: Value;
    /**
     * Callback function that is fired when the slider's value changed.
     * You can pull out the new value by accessing `event.target.value` (any).
     *
     * The `eventDetails.reason` indicates what triggered the change:
     *
     * - `'input-change'` when the hidden range input emits a change event (for example, via form integration)
     * - `'track-press'` when the control track is pressed
     * - `'drag'` while dragging a thumb
     * - `'keyboard'` for keyboard input
     * - `'none'` when the change is triggered without a specific interaction
     */
    onValueChange?: (value: Value extends number ? number : Value, eventDetails: SliderRoot.ChangeEventDetails) => void;
    /**
     * Callback function that is fired when the `pointerup` is triggered.
     * **Warning**: This is a generic event not a change event.
     *
     * The `eventDetails.reason` indicates what triggered the commit:
     *
     * - `'drag'` while dragging a thumb
     * - `'track-press'` when the control track is pressed
     * - `'keyboard'` for keyboard input
     * - `'input-change'` when the hidden range input emits a change event (for example, via form integration)
     * - `'none'` when the commit occurs without a specific interaction
     */
    onValueCommitted?: (value: Value extends number ? number : Value, eventDetails: SliderRoot.CommitEventDetails) => void;
} & HeadlessUIComponentProps<'div', SliderRoot.State>;

export type SliderRootChangeEventCustomProperties = {
    /**
     * The index of the active thumb at the time of the change.
     */
    activeThumbIndex: number;
};

export type SliderRootChangeEventReason =
    | typeof REASONS.inputChange
    | typeof REASONS.trackPress
    | typeof REASONS.drag
    | typeof REASONS.keyboard
    | typeof REASONS.none;
export type SliderRootChangeEventDetails = HeadlessUIChangeEventDetails<
    SliderRoot.ChangeEventReason,
    SliderRootChangeEventCustomProperties
>;

export type SliderRootCommitEventReason =
    | typeof REASONS.inputChange
    | typeof REASONS.trackPress
    | typeof REASONS.drag
    | typeof REASONS.keyboard
    | typeof REASONS.none;
export type SliderRootCommitEventDetails = HeadlessUIGenericEventDetails<SliderRoot.CommitEventReason>;

export namespace SliderRoot {
    export type State = SliderRootState;
    export type Props<Value extends number | readonly number[] = number | readonly number[]> = SliderRootProps<Value>;
    export type ChangeEventReason = SliderRootChangeEventReason;
    export type ChangeEventDetails = SliderRootChangeEventDetails;
    export type CommitEventReason = SliderRootCommitEventReason;
    export type CommitEventDetails = SliderRootCommitEventDetails;
}
