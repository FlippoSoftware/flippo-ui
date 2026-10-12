import React from 'react';

import { ComboboxItemMachine } from '@flippo-software/core-components/combobox';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useComboboxListContext } from '../list/ComboboxListContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';
import { useComboboxRowContext } from '../row/ComboboxRowContext';

import { ComboboxItemContext } from './ComboboxItemContext';

import type { ComboboxItemContextValue } from './ComboboxItemContext';

/**
 * An individual item in the list.
 * Renders a `<div>` element.
 */
export const ComboboxItem = React.memo((componentProps: ComboboxItem.Props) => {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        value = null,
        index,
        disabled = false,
        nativeButton = false,
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const list = useComboboxListContext();
    const inRow = useComboboxRowContext();

    const item = useMachine((options) => new ComboboxItemMachine(root, options, { registry: list?.registry ?? null, inRow }), {
        value,
        index,
        disabled,
        nativeButton
    });
    const state: ComboboxItem.State = useMachineState(item);
    const track = useTracker();
    const { selected } = state;

    const contextValue: ComboboxItemContextValue = React.useMemo(() => ({ item, selected }), [item, selected]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, item.setElement],
        state,
        props: [elementProps, (props) => track(() => toReactProps(item.getItemProps(props)))]
    });

    return <ComboboxItemContext value={contextValue}>{element}</ComboboxItemContext>;
});

export type ComboboxItemState = {
    /**
     * Whether the item should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the item is selected.
     */
    selected: boolean;
    /**
     * Whether the item is highlighted.
     */
    highlighted: boolean;
};

export type ComboboxItemProps = {
    children?: React.ReactNode;
    /**
     * An optional click handler for the item when selected.
     * It fires when clicking the item with the pointer, as well as when pressing `Enter` with the keyboard
     * if the item is highlighted when the `Input` or `List` element has focus.
     */
    onClick?: React.MouseEventHandler<HTMLElement>;
    /**
     * The index of the item in the list. Improves performance when specified by avoiding the need to calculate
     * the index automatically from the DOM.
     */
    index?: number;
    /**
     * A unique value that identifies this item.
     * @default null
     */
    value?: any;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & NonNativeButtonProps &
    Omit<HeadlessUIComponentProps<'div', ComboboxItem.State>, 'id'>;

// eslint-disable-next-line ts/no-redeclare
export namespace ComboboxItem {
    export type State = ComboboxItemState;
    export type Props = ComboboxItemProps;
}
