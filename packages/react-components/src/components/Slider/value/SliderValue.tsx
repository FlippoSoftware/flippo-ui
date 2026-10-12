import type React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { SliderRoot } from '../root/SliderRoot';

/**
 * Displays the current value of the slider as text.
 * Renders an `<output>` element.
 */
export function SliderValue(componentProps: SliderValue.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        'aria-live': ariaLive = 'off',
        children,
        ref,
        ...elementProps
    } = componentProps;

    const { slider, state } = useSliderRootContext();

    return useRenderElement('output', componentProps, {
        state,
        ref,
        props: [
            {
                // off by default because it will keep announcing when the slider is being dragged
                // and also when the value is changing (but not yet committed)
                'aria-live': ariaLive,
                children:
                    typeof children === 'function'
                        ? children(slider.getFormattedValues(), slider.values as number[])
                        : slider.getDefaultDisplayValue(),
                htmlFor: slider.getValueOutputFor()
            },
            elementProps
        ],
        customStyleHookMapping: sliderStyleHookMapping
    });
}

export type SliderValueProps = {
    children?: null | ((formattedValues: readonly string[], values: readonly number[]) => React.ReactNode);
} & Omit<HeadlessUIComponentProps<'output', SliderRoot.State>, 'children'>;

export namespace SliderValue {
    export type Props = SliderValueProps;
}
