import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMeterRootContext } from '../root/MeterRootContext';

import type { MeterRoot } from '../root/MeterRoot';

/**
 * Visualizes the completion status of the task.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Meter](https://base-ui.com/react/components/progress)
 */
export function MeterIndicator(componentProps: MeterIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { meter } = useMeterRootContext();

    const element = useRenderElement('div', componentProps, {
        ref,
        props: [{ style: meter.getIndicatorStyle() }, elementProps]
    });

    return element;
}

export namespace MeterIndicator {
    export type Props = HeadlessUIComponentProps<'div', MeterRoot.State>;
}
