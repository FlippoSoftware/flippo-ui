import React from 'react';

import { SliderThumbMachine } from '@flippo-software/core-components/slider';
import { useOnMount } from '@flippo-ui/hooks';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useLabelableContext, useLabelableId } from '../../LabelableProvider';
import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { LabelableContextValue } from '../../LabelableProvider';
import type { SliderRoot } from '../root/SliderRoot';

/**
 * The draggable part of the slider at the tip of the indicator.
 * Renders a `<div>` element and a nested `<input type="range">`.
 */
export function SliderThumb(componentProps: SliderThumb.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        disabled,
        getAriaLabel,
        getAriaValueText,
        id: idProp,
        index,
        inputRef: inputRefProp,
        tabIndex,
        ref,
        ...elementProps
    } = componentProps;

    const { slider, state } = useSliderRootContext();
    const { labelable } = useLabelableContext();

    const id = useHeadlessUiId(idProp) as string;
    const defaultInputId = useHeadlessUiId() as string;
    const labelableInputId = useLabelableId();

    const thumb = useMachine((options) => new SliderThumbMachine(slider, options), {
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        disabled,
        getAriaLabel,
        getAriaValueText,
        index,
        tabIndex,
        labelable,
        id,
        defaultInputId,
        labelableInputId
    });
    const track = useTracker();

    // Positions measured on the client: the first render matches the server.
    const [isMounted, setIsMounted] = React.useState(false);
    useOnMount(() => setIsMounted(true));

    const inputRef = React.useCallback(
        (inputElement: HTMLInputElement | null) => {
            thumb.setInputElement(inputElement);
            if (typeof inputRefProp === 'function') {
                inputRefProp(inputElement);
            } else if (inputRefProp) {
                (inputRefProp as React.RefObject<HTMLInputElement | null>).current = inputElement;
            }
        },
        [thumb, inputRefProp]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, thumb.setThumbElement],
        props: [
            elementProps,
            (props) => track(() => toReactProps(thumb.getProps(props, isMounted))),
            {
                children: (
                    <React.Fragment>
                        {children}
                        <input {...track(() => toReactProps(thumb.getInputProps()))} ref={inputRef} />
                    </React.Fragment>
                )
            }
        ],
        customStyleHookMapping: sliderStyleHookMapping
    });
}

export type ThumbMetadata = {
    inputId: LabelableContextValue['controlId'];
};

export type SliderThumbState = {} & SliderRoot.State;

export type SliderThumbProps = {
    /**
     * Whether the thumb should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * A function which returns a string value for the [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) attribute of the `input`.
     */
    getAriaLabel?: ((index: number) => string) | null;
    /**
     * A function which returns a string value for the [`aria-valuetext`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext) attribute of the `input`.
     * This is important for screen reader users.
     */
    getAriaValueText?: ((formattedValue: string, value: number, index: number) => string) | null;
    /**
     * The index of the thumb which corresponds to the index of its value in the
     * `value` or `defaultValue` array.
     * This prop is required to support server-side rendering for range sliders
     * with multiple thumbs.
     * @example
     * ```tsx
     * <Slider.Root value={[10, 20]}>
     *   <Slider.Thumb index={0} />
     *   <Slider.Thumb index={1} />
     * </Slider.Root>
     * ```
     */
    index?: number | undefined;
    /**
     * A ref to access the nested input element.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * A blur handler forwarded to the `input`.
     */
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    /**
     * A focus handler forwarded to the `input`.
     */
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    /**
     * Optional tab index attribute forwarded to the `input`.
     */
    tabIndex?: number;
} & Omit<HeadlessUIComponentProps<'div', SliderThumb.State>, 'onBlur' | 'onFocus'>;

export namespace SliderThumb {
    export type State = SliderThumbState;
    export type Props = SliderThumbProps;
}
