

import React from 'react';

import { formatNumber } from '~@lib/formatNumber';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSliderRootContext } from '../root/SliderRootContext';
import { sliderStyleHookMapping } from '../root/styleHooks';

import type { SliderRoot } from '../root/SliderRoot';

/**
 * Displays the current value of the slider as text.
 * Renders an `<output>` element.
 *
 * Documentation: [Base UI Slider](https://base-ui.com/react/components/slider)
 */
export function SliderValue(componentProps: SliderValue.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        'aria-live': ariaLive = 'off',
        children,
        ref,
        ...elementProps
    } = componentProps;

    const {
        thumbMap,
        state,
        values,
        formatOptionsRef,
        locale
    } = useSliderRootContext();

    const outputFor = React.useMemo(() => {
        let htmlFor = '';
        for (const thumbMetadata of thumbMap.values()) {
            if (thumbMetadata?.inputId) {
                htmlFor += `${thumbMetadata.inputId} `;
            }
        }
        return htmlFor.trim() === '' ? undefined : htmlFor.trim();
    }, [thumbMap]);

    const formattedValues = React.useMemo(() => {
        const arr = [];
        for (let i = 0; i < values.length; i += 1) {
            arr.push(formatNumber(values[i], locale, formatOptionsRef.current ?? undefined));
        }
        return arr;
    }, [formatOptionsRef, locale, values]);

    const defaultDisplayValue = React.useMemo(() => {
        const arr = [];
        for (let i = 0; i < values.length; i += 1) {
            arr.push(formattedValues[i] || values[i]);
        }
        return arr.join(' – ');
    }, [values, formattedValues]);

    const element = useRenderElement('output', componentProps, {
        state,
        ref,
        props: [{
            // off by default because it will keep announcing when the slider is being dragged
            // and also when the value is changing (but not yet committed)
            'aria-live': ariaLive,
            'children':
          typeof children === 'function' ? children(formattedValues, values) : defaultDisplayValue,
            'htmlFor': outputFor
        }, elementProps],
        customStyleHookMapping: sliderStyleHookMapping
    });

    return element;
}

export namespace SliderValue {
    export type Props = {
        children?:
          | null
          | ((formattedValues: readonly string[], values: readonly number[]) => React.ReactNode);
    } & Omit<HeadlessUIComponentProps<'output', SliderRoot.State>, 'children'>;
}
