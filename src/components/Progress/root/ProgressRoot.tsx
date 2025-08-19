'use client';

import React from 'react';

import { useLatestRef } from '@flippo_ui/hooks';

import { formatNumber } from '@lib/formatNumber';
import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { ProgressRootContext } from './ProgressRootContext';
import { progressStyleHookMapping } from './styleHooks';

import type { TProgressRootContext } from './ProgressRootContext';

function formatValue(
    value: number | null,
    locale?: Intl.LocalesArgument,
    format?: Intl.NumberFormatOptions
): string {
    if (value == null) {
        return '';
    }

    if (!format) {
        return formatNumber(value / 100, locale, { style: 'percent' });
    }

    return formatNumber(value, locale, format);
}

function getDefaultAriaValueText(formattedValue: string | null, value: number | null) {
    if (value == null) {
        return 'indeterminate progress';
    }

    return formattedValue || `${value}%`;
}

/**
 * Groups all parts of the progress bar and provides the task completion status to screen readers.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Progress](https://base-ui.com/react/components/progress)
 */
export function ProgressRoot(componentProps: ProgressRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        format,
        getAriaValueText = getDefaultAriaValueText,
        locale,
        max = 100,
        min = 0,
        value,
        ref,
        ...elementProps
    } = componentProps;

    const [labelId, setLabelId] = React.useState<string | undefined>();

    const formatOptionsRef = useLatestRef(format);

    let status: ProgressRoot.Status = 'indeterminate';
    if (Number.isFinite(value)) {
        status = value === max ? 'complete' : 'progressing';
    }
    const formattedValue = formatValue(value, locale, formatOptionsRef.current);

    const state: ProgressRoot.State = React.useMemo(
        () => ({
            status
        }),
        [status]
    );

    const defaultProps: HTMLProps = {
        'aria-labelledby': labelId,
        'aria-valuemax': max,
        'aria-valuemin': min,
        'aria-valuenow': value ?? undefined,
        'aria-valuetext': getAriaValueText(formattedValue, value),
        'role': 'progressbar'
    };

    const contextValue: TProgressRootContext = React.useMemo(
        () => ({
            formattedValue,
            max,
            min,
            setLabelId,
            state,
            status,
            value
        }),
        [
            formattedValue,
            max,
            min,
            setLabelId,
            state,
            status,
            value
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [defaultProps, elementProps],
        customStyleHookMapping: progressStyleHookMapping
    });

    return (
        <ProgressRootContext value={contextValue}>{element}</ProgressRootContext>
    );
}

export namespace ProgressRoot {
    export type Status = 'indeterminate' | 'progressing' | 'complete';

    export type State = {
        status: Status;
    };

    export type Props = {
        /**
         * A string value that provides a user-friendly name for `aria-valuenow`, the current value of the meter.
         */
        'aria-valuetext'?: React.AriaAttributes['aria-valuetext'];
        /**
         * Options to format the value.
         */
        'format'?: Intl.NumberFormatOptions;
        /**
         * Accepts a function which returns a string value that provides a human-readable text alternative for the current
         * value of the progress bar.
         * @param {string} formattedValue The component's formatted value.
         * @param {number | null} value The component's numerical value.
         * @returns {string}
         */
        'getAriaValueText'?: (formattedValue: string | null, value: number | null) => string;
        /**
         * The locale used by `Intl.NumberFormat` when formatting the value.
         * Defaults to the user's runtime locale.
         */
        'locale'?: Intl.LocalesArgument;
        /**
         * The maximum value.
         * @default 100
         */
        'max'?: number;
        /**
         * The minimum value.
         * @default 0
         */
        'min'?: number;
        /**
         * The current value. The component is indeterminate when value is `null`.
         * @default null
         */
        'value': number | null;
    } & HeadlessUIComponentProps<'div', State>;
}
