

import type React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMeterRootContext } from '../root/MeterRootContext';

import type { MeterRoot } from '../root/MeterRoot';
/**
 * A text label displaying the current value.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Meter](https://base-ui.com/react/components/progress)
 */
export function MeterValue(componentProps: MeterValue.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        ref,
        ...elementProps
    } = componentProps;

    const { value, formattedValue } = useMeterRootContext();

    return useRenderElement('span', componentProps, {
        ref,
        props: [{
            'aria-hidden': true,
            'children':
                    typeof children === 'function'
                        ? children(formattedValue, value)
                        : ((formattedValue || value) ?? '')
        }, elementProps]
    });
}

export namespace MeterValue {
    export type Props = {
        children?: null | ((formattedValue: string | null, value: number | null) => React.ReactNode);
    } & Omit<HeadlessUIComponentProps<'span', MeterRoot.State>, 'children'>;
}
