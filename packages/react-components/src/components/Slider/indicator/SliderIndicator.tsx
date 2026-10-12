import React from 'react';

import { useOnMount } from '@flippo-software/hooks';

import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { SliderRoot } from '../root/SliderRoot';

/**
 * Visualizes the current value of the slider.
 * Renders a `<div>` element.
 */
export function SliderIndicator(componentProps: SliderIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { slider, state } = useSliderRootContext();

    // Inset positions are measured on the client: the first render matches the server.
    const [isMounted, setIsMounted] = React.useState(false);
    useOnMount(() => setIsMounted(true));

    return useRenderElement('div', componentProps, {
        state,
        ref,
        props: [toReactProps(slider.getIndicatorProps(isMounted)), elementProps],
        customStyleHookMapping: sliderStyleHookMapping
    });
}

export type SliderIndicatorProps = {} & HeadlessUIComponentProps<'div', SliderRoot.State>;

export namespace SliderIndicator {
    export type Props = SliderIndicatorProps;
}
