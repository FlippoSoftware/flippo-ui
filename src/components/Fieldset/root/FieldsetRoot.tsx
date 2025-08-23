'use client';

import React from 'react';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { FieldsetRootContext } from './FieldsetRootContext';

import type { TFieldsetRootContext } from './FieldsetRootContext';

/**
 * Groups the fieldset legend and the associated fields.
 * Renders a `<fieldset>` element.
 *
 * Documentation: [Base UI Fieldset](https://base-ui.com/react/components/fieldset)
 */
export function FieldsetRoot(componentProps: FieldsetRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        ref,
        ...elementProps
    } = componentProps;

    const [legendId, setLegendId] = React.useState<string | undefined>(undefined);

    const state: FieldsetRoot.State = React.useMemo(
        () => ({
            disabled
        }),
        [disabled]
    );

    const element = useRenderElement('fieldset', componentProps, {
        ref,
        state,
        props: [{
            'aria-labelledby': legendId
        }, elementProps]
    });

    const contextValue: TFieldsetRootContext = React.useMemo(
        () => ({
            legendId,
            setLegendId,
            disabled
        }),
        [legendId, setLegendId, disabled]
    );

    return (
        <FieldsetRootContext value={contextValue}>{element}</FieldsetRootContext>
    );
}

export namespace FieldsetRoot {
    export type State = {
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
    };

    export type Props = HeadlessUIComponentProps<'fieldset', State>;
}
