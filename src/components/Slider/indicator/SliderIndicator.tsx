'use client';

import type React from 'react';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';
import { valueArrayToPercentages } from '../utils/valueArrayToPercentages';

import type { SliderRoot } from '../root/SliderRoot';

function getRangeStyles(
    orientation: Orientation,
    offset: number,
    leap: number
): React.CSSProperties {
    if (orientation === 'vertical') {
        return {
            position: 'absolute',
            bottom: `${offset}%`,
            height: `${leap}%`,
            width: 'inherit'
        };
    }

    return {
        position: 'relative',
        insetInlineStart: `${offset}%`,
        width: `${leap}%`,
        height: 'inherit'
    };
}

/**
 * Visualizes the current value of the slider.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Slider](https://base-ui.com/react/components/slider)
 */
export function SliderIndicator(componentProps: SliderIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        max,
        min,
        orientation,
        state,
        values
    } = useSliderRootContext();

    const percentageValues = valueArrayToPercentages(values.slice(), min, max);

    let style: React.CSSProperties;

    if (percentageValues.length > 1) {
        const trackOffset = percentageValues[0] ?? 0;
        const trackLeap = (percentageValues.at(-1) ?? 0) - trackOffset;

        style = getRangeStyles(orientation, trackOffset, trackLeap);
    }
    else if (orientation === 'vertical') {
        style = {
            position: 'absolute',
            bottom: 0,
            height: `${percentageValues[0]}%`,
            width: 'inherit'
        };
    }
    else {
        style = {
            position: 'relative',
            insetInlineStart: 0,
            width: `${percentageValues[0]}%`,
            height: 'inherit'
        };
    }

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{ style }, elementProps],
        customStyleHookMapping: sliderStyleHookMapping
    });

    return element;
}

export namespace SliderIndicator {
    export type Props = HeadlessUIComponentProps<'div', SliderRoot.State>;
}
