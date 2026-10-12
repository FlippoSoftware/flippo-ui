import React from 'react';

import { MeterMachine } from '@flippo-software/core-components/meter';

import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { MeterRootContext } from './MeterRootContext';

import type { MeterRootContextValue } from './MeterRootContext';

export function MeterRoot(componentProps: MeterRoot.Props) {
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
        value: valueProp,
        ref,
        ...elementProps
    } = componentProps;

    const meter = useMachine((options) => new MeterMachine(options), {
        format,
        getAriaValueText,
        locale,
        max,
        min,
        value: valueProp
    });
    const track = useTracker();

    const formattedValue = meter.formattedValue;

    // A new value whenever what the parts render changes, so they update even when memoized.
    const contextValue: MeterRootContextValue = React.useMemo(
        () => ({ meter, formattedValue, max, min, value: valueProp }),
        [meter, formattedValue, max, min, valueProp]
    );

    const element = useRenderElement('div', componentProps, {
        ref,
        props: [track(() => toReactProps(meter.getRootProps())), elementProps]
    });

    return <MeterRootContext value={contextValue}>{element}</MeterRootContext>;
}

export namespace MeterRoot {
    export type State = object;

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
         * A function that returns a string value that provides a human-readable text alternative for `aria-valuenow`,
         * the current value of the meter.
         * @param {string} formattedValue The formatted value
         * @param {number} value The raw value
         * @returns {string}
         */
        getAriaValueText?: (formattedValue: string, value: number) => string;
        /**
         * The locale used by `Intl.NumberFormat` when formatting the value.
         * Defaults to the user's runtime locale.
         */
        locale?: Intl.LocalesArgument;
        /**
         * The maximum value
         * @default 100
         */
        max?: number;
        /**
         * The minimum value
         * @default 0
         */
        min?: number;
        /**
         * The current value.
         */
        value: number;
    } & HeadlessUIComponentProps<'div', State>;
}
