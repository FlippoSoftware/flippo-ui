'use client';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useProgressRootContext } from '../root/ProgressRootContext';
import { progressStyleHookMapping } from '../root/styleHooks';

import type { ProgressRoot } from '../root/ProgressRoot';

/**
 * An accessible label for the progress bar.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Progress](https://base-ui.com/react/components/progress)
 */
export function ProgressLabel(componentProps: ProgressLabel.Props) {
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

    const { setLabelId, state } = useProgressRootContext();

    useIsoLayoutEffect(() => {
        setLabelId(id);

        return () => setLabelId(undefined);
    }, [id, setLabelId]);

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: [{
            id
        }, elementProps],
        customStyleHookMapping: progressStyleHookMapping
    });

    return element;
}

export namespace ProgressLabel {
    export type Props = HeadlessUIComponentProps<'span', ProgressRoot.State>;
}
