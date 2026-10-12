import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMeterRootContext } from '../root/MeterRootContext';

import type { MeterRoot } from '../root/MeterRoot';

/**
 * An accessible label for the progress bar.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Meter](https://base-ui.com/react/components/progress)
 */
export function MeterLabel(componentProps: MeterLabel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp);

    const { meter } = useMeterRootContext();

    useIsoLayoutEffect(() => {
        meter.setLabelId(id);

        return () => meter.setLabelId(undefined);
    }, [id, meter]);

    const element = useRenderElement('span', componentProps, {
        ref,
        props: [
            {
                id
            },
            elementProps
        ]
    });

    return element;
}

export namespace MeterLabel {
    export type Props = HeadlessUIComponentProps<'span', MeterRoot.State>;
}
