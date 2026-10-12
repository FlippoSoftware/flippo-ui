import React from 'react';

import { ProgressMachine } from '@flippo-software/core-components/progress';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { ProgressRootContext } from './ProgressRootContext';
import { progressStyleHookMapping } from './styleHooks';

import type { ProgressRootContextValue } from './ProgressRootContext';

export function ProgressRoot(componentProps: ProgressRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        format,
        getAriaValueText,
        locale,
        max = 100,
        min = 0,
        value,
        ref,
        ...elementProps
    } = componentProps;

    const progress = useMachine((options) => new ProgressMachine(options), {
        format,
        getAriaValueText,
        locale,
        max,
        min,
        value
    });
    const track = useTracker();

    const { status } = track(() => progress.getState());
    const formattedValue = progress.formattedValue;

    const state: ProgressRoot.State = React.useMemo(() => ({ status }), [status]);

    // A new value whenever what the parts render changes, so they update even when memoized.
    const contextValue: ProgressRootContextValue = React.useMemo(
        () => ({ progress, formattedValue, max, min, state, status, value }),
        [progress, formattedValue, max, min, state, status, value]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [track(() => toReactProps(progress.getRootProps())), elementProps],
        customStyleHookMapping: progressStyleHookMapping
    });

    return <ProgressRootContext value={contextValue}>{element}</ProgressRootContext>;
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
        format?: Intl.NumberFormatOptions;
        /**
         * Accepts a function which returns a string value that provides a human-readable text alternative for the current
         * value of the progress bar.
         * @param {string} formattedValue The component's formatted value.
         * @param {number | null} value The component's numerical value.
         * @returns {string}
         */
        getAriaValueText?: (formattedValue: string | null, value: number | null) => string;
        /**
         * The locale used by `Intl.NumberFormat` when formatting the value.
         * Defaults to the user's runtime locale.
         */
        locale?: Intl.LocalesArgument;
        /**
         * The maximum value.
         * @default 100
         */
        max?: number;
        /**
         * The minimum value.
         * @default 0
         */
        min?: number;
        /**
         * The current value. The component is indeterminate when value is `null`.
         * @default null
         */
        value: number | null;
    } & HeadlessUIComponentProps<'div', State>;
}
