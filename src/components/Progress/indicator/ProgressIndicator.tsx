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

    const { progress, state } = useProgressRootContext();

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{ style: progress.getIndicatorStyle() }, elementProps],
        customStyleHookMapping: progressStyleHookMapping
    });

    return element;
}

export namespace ProgressIndicator {
    export type Props = HeadlessUIComponentProps<'div', ProgressRoot.State>;
}
