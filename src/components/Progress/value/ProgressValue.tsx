

import type React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useProgressRootContext } from '../root/ProgressRootContext';
import { progressStyleHookMapping } from '../root/styleHooks';

import type { ProgressRoot } from '../root/ProgressRoot';
/**
 * A text label displaying the current value.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Progress](https://base-ui.com/react/components/progress)
 */
export function ProgressValue(componentProps: ProgressValue.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        ref,
        ...elementProps
    } = componentProps;

    const { value, formattedValue, state } = useProgressRootContext();

    const formattedValueArg = value == null ? 'indeterminate' : formattedValue;
    const formattedValueDisplay = value == null ? null : formattedValue;

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: [{
            'aria-hidden': true,
            'children':
                    typeof children === 'function'
                        ? children(formattedValueArg, value)
                        : formattedValueDisplay
        }, elementProps],
        customStyleHookMapping: progressStyleHookMapping
    });

    return element;
}

export namespace ProgressValue {
    export type Props = {
        children?: null | ((formattedValue: string | null, value: number | null) => React.ReactNode);
    } & Omit<HeadlessUIComponentProps<'span', ProgressRoot.State>, 'children'>;
}
