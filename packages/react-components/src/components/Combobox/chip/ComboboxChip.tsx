import React from 'react';

import { ComboboxChipMachine } from '@flippo-software/core-components/combobox';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import { toReactProps, useMachineState, useStoreState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxChipsContext } from '../chips/ComboboxChipsContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

import { ComboboxChipContext } from './ComboboxChipContext';

import type { ComboboxChipContextValue } from './ComboboxChipContext';

/**
 * An individual chip that represents a value in a multiselectable input.
 * Renders a `<div>` element.
 */
export function ComboboxChip(componentProps: ComboboxChip.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const chips = useComboboxChipsContext();
    if (!chips) {
        throw new Error('Headless UI: <Combobox.Chip> must be placed within <Combobox.Chips>.');
    }

    const [chip] = React.useState(() => new ComboboxChipMachine(root, chips));
    useIsoLayoutEffect(() => chip.connect(), [chip]);
    const { index } = useStoreState(chip.index);
    const state: ComboboxChip.State = useMachineState(chip);
    const track = useTracker();

    const contextValue: ComboboxChipContextValue = React.useMemo(() => ({ chip, index }), [chip, index]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, chip.setElement],
        state,
        props: [elementProps, (props) => track(() => toReactProps(chip.getChipProps(props)))]
    });

    return <ComboboxChipContext value={contextValue}>{element}</ComboboxChipContext>;
}

export type ComboboxChipState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
};

export type ComboboxChipProps = {} & HeadlessUIComponentProps<'div', ComboboxChip.State>;

export namespace ComboboxChip {
    export type State = ComboboxChipState;
    export type Props = ComboboxChipProps;
}
