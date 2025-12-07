import React from 'react';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { ComboboxRowContext } from './ComboboxRowContext';

/**
 * Displays a single row of items in a grid list.
 * Enable `grid` on the root component to turn the listbox into a grid.
 * Renders a `<div>` element.
 */
export function ComboboxRow(componentProps: ComboboxRow.Props) {
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
        props: [{ role: 'row' }, elementProps]
    });

    return <ComboboxRowContext.Provider value>{element}</ComboboxRowContext.Provider>;
}

export type ComboboxRowState = {};

export type ComboboxRowProps = {} & HeadlessUIComponentProps<'div', ComboboxRow.State>;

export namespace ComboboxRow {
    export type State = ComboboxRowState;
    export type Props = ComboboxRowProps;
}
