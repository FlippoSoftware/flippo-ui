

import React from 'react';

import { valueToPercent } from '~@lib/valueToPercent';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useProgressRootContext } from '../root/ProgressRootContext';
import { progressStyleHookMapping } from '../root/styleHooks';

import type { ProgressRoot } from '../root/ProgressRoot';

/**
 * Visualizes the completion status of the task.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Progress](https://base-ui.com/react/components/progress)
 */
export function ProgressIndicator(componentProps: ProgressIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        max,
        min,
        value,
        state
    } = useProgressRootContext();

    const percentageValue
        = Number.isFinite(value) && value !== null ? valueToPercent(value, min, max) : null;

    const getStyles = React.useCallback(() => {
        if (percentageValue == null) {
            return {};
        }

        return {
            insetInlineStart: 0,
            height: 'inherit',
            width: `${percentageValue}%`
        };
    }, [percentageValue]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            style: getStyles()
        }, elementProps],
        customStyleHookMapping: progressStyleHookMapping
    });

    return element;
}

export namespace ProgressIndicator {
    export type Props = HeadlessUIComponentProps<'div', ProgressRoot.State>;
}
