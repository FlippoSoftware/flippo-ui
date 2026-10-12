import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { SliderRoot } from '../root/SliderRoot';

/**
 * The clickable, interactive part of the slider.
 * Renders a `<div>` element.
 */
export function SliderControl(componentProps: SliderControl.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { slider, state } = useSliderRootContext();

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, slider.setControlElement],
        props: [elementProps, (props) => toReactProps(slider.getControlProps(props))],
        customStyleHookMapping: sliderStyleHookMapping
    });
}

export type SliderControlProps = {} & HeadlessUIComponentProps<'div', SliderRoot.State>;

export namespace SliderControl {
    export type State = SliderRoot.State;
    export type Props = SliderControlProps;
}
