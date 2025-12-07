import React from 'react';

import { useOnMount } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { valueToPercent } from '~@lib/valueToPercent';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { SliderRoot } from '../root/SliderRoot';

function getInsetStyles(
    vertical: boolean,
    range: boolean,
    start: number | undefined,
    end: number | undefined,
    renderBeforeHydration: boolean,
    mounted: boolean
): React.CSSProperties & Record<string, unknown> {
    const visibility
        = start === undefined || (range && end === undefined) ? ('hidden' as const) : undefined;

    const startEdge = vertical ? 'bottom' : 'insetInlineStart';
    const mainSide = vertical ? 'height' : 'width';
    const crossSide = vertical ? 'width' : 'height';

    const styles: React.CSSProperties & Record<string, unknown> = {
        visibility: renderBeforeHydration && !mounted ? 'hidden' : visibility,
        position: vertical ? 'absolute' : 'relative',
        [crossSide]: 'inherit'
    };

    styles['--start-position'] = `${start ?? 0}%`;

    if (!range) {
        styles[startEdge] = 0;
        styles[mainSide] = 'var(--start-position)';

        return styles;
    }

    styles['--relative-size'] = `${(end ?? 0) - (start ?? 0)}%`;

    styles[startEdge] = 'var(--start-position)';
    styles[mainSide] = 'var(--relative-size)';

    return styles;
}

function getCenteredStyles(
    vertical: boolean,
    range: boolean,
    start: number,
    end: number
): React.CSSProperties {
    const startEdge = vertical ? 'bottom' : 'insetInlineStart';
    const mainSide = vertical ? 'height' : 'width';
    const crossSide = vertical ? 'width' : 'height';

    const styles: React.CSSProperties = {
        position: vertical ? 'absolute' : 'relative',
        [crossSide]: 'inherit'
    };

    if (!range) {
        styles[startEdge] = 0;
        styles[mainSide] = `${start}%`;

        return styles;
    }

    const size = end - start;

    styles[startEdge] = `${start}%`;
    styles[mainSide] = `${size}%`;

    return styles;
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
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        indicatorPosition,
        inset,
        max,
        min,
        orientation,
        renderBeforeHydration,
        state,
        values
    }
        = useSliderRootContext();

    const [isMounted, setIsMounted] = React.useState(false);
    useOnMount(() => setIsMounted(true));

    const vertical = orientation === 'vertical';
    const range = values.length > 1;

    const style = inset
        ? getInsetStyles(
            vertical,
            range,
            indicatorPosition[0],
            indicatorPosition[1],
            renderBeforeHydration,
            isMounted
        )
        : getCenteredStyles(
            vertical,
            range,
            valueToPercent(values[0] ?? 0, min, max),
            valueToPercent(values[values.length - 1] ?? 0, min, max)
        );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            ['data-base-ui-slider-indicator' as string]: renderBeforeHydration ? '' : undefined,
            style,
            suppressHydrationWarning: renderBeforeHydration || undefined
        }, elementProps],
        customStyleHookMapping: sliderStyleHookMapping
    });

    return element;
}

export type SliderIndicatorProps = {} & HeadlessUIComponentProps<'div', SliderRoot.State>;

export namespace SliderIndicator {
    export type Props = SliderIndicatorProps;
}
