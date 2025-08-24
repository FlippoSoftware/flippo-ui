'use client';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { SliderRoot } from '../root/SliderRoot';

/**
 * Contains the slider indicator and represents the entire range of the slider.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Slider](https://base-ui.com/react/components/slider)
 */
export function SliderTrack(componentProps: SliderTrack.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { state } = useSliderRootContext();

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            style: {
                position: 'relative'
            }
        }, elementProps],
        customStyleHookMapping: sliderStyleHookMapping
    });

    return element;
}

export namespace SliderTrack {
    export type Props = HeadlessUIComponentProps<'div', SliderRoot.State>;
}
