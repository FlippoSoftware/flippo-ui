import React from 'react';

import { SelectItemMachine } from '@flippo-software/core-components/select';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRootContext } from '../root/SelectRootContext';

import { SelectItemContext } from './SelectItemContext';

import type { SelectItemContextValue } from './SelectItemContext';

/**
 * An individual option in the select popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectItem(componentProps: SelectItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        value = null,
        label,
        disabled = false,
        nativeButton = false,
        ref,
        ...elementProps
    } = componentProps;

    const root = useSelectRootContext();
    const { positioner } = useSelectPositionerContext();

    const item = useMachine((options) => new SelectItemMachine(root, positioner.items, options), {
        value,
        label,
        disabled,
        nativeButton
    });
    const track = useTracker();
    const state: SelectItem.State = useMachineState(item);
    const { selected } = state;

    const contextValue: SelectItemContextValue = React.useMemo(() => ({ item, selected }), [item, selected]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, item.setElement],
        state,
        props: [elementProps, (props) => track(() => toReactProps(item.getItemProps(props)))]
    });

    return <SelectItemContext value={contextValue}>{element}</SelectItemContext>;
}

export type SelectItemState = {
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

export type SelectItemProps = {
    children?: React.ReactNode;
    /**
     * A unique value that identifies this select item.
     * @default null
     */
    value?: any;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Specifies the text label to use when the item is matched during keyboard text navigation.
     *
     * Defaults to the item text content if not provided.
     */
    label?: string;
} & NonNativeButtonProps &
    Omit<HeadlessUIComponentProps<'div', SelectItem.State>, 'id'>;

export namespace SelectItem {
    export type State = SelectItemState;
    export type Props = SelectItemProps;
}
