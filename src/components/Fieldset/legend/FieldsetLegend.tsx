import * as React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useFieldsetRootContext } from '../root/FieldsetRootContext';

/**
 * An accessible label that is automatically associated with the fieldset.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Fieldset](https://base-ui.com/react/components/fieldset)
 */
export function FieldsetLegend(componentProps: FieldsetLegend.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const { disabled, setLegendId } = useFieldsetRootContext();

    const id = useHeadlessUiId(idProp);

    useIsoLayoutEffect(() => {
        setLegendId(id);
        return () => {
            setLegendId(undefined);
        };
    }, [setLegendId, id]);

    const state: FieldsetLegend.State = React.useMemo(
        () => ({
            disabled: disabled ?? false
        }),
        [disabled]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export namespace FieldsetLegend {
    export type State = {
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
    };

    export type Props = HeadlessUIComponentProps<'div', State>;
}
