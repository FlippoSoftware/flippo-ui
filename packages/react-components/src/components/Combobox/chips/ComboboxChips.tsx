import React from 'react';

import { ComboboxChipsMachine } from '@flippo-software/core-components/combobox';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxRootMachine } from '../root/ComboboxRootContext';

import { ComboboxChipsContext } from './ComboboxChipsContext';

/**
 * A container for the chips in a multiselectable input.
 * Renders a `<div>` element.
 */
export function ComboboxChips(componentProps: ComboboxChips.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();

    const [chips] = React.useState(() => new ComboboxChipsMachine(root));
    useIsoLayoutEffect(() => chips.connect(), [chips]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, chips.setElement],
        props: elementProps
    });

    return <ComboboxChipsContext value={chips}>{element}</ComboboxChipsContext>;
}

export type ComboboxChipsState = {};

export type ComboboxChipsProps = {} & HeadlessUIComponentProps<'div', ComboboxChips.State>;

export namespace ComboboxChips {
    export type State = ComboboxChipsState;
    export type Props = ComboboxChipsProps;
}
