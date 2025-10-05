

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import type { MeterRoot } from '../root/MeterRoot';

/**
 * Contains the progress bar indicator.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Meter](https://base-ui.com/react/components/progress)
 */
export function MeterTrack(componentProps: MeterTrack.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const element = useRenderElement('div', componentProps, {
        ref,
        props: elementProps
    });

    return element;
}

export namespace MeterTrack {
    export type Props = HeadlessUIComponentProps<'div', MeterRoot.State>;
}
