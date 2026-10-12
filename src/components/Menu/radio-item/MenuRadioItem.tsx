import React from 'react';

import { MenuRadioItemMachine } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useMenuItemSetup } from '../item/useMenuItem';
import { useMenuRadioGroupContext } from '../radio-group/MenuRadioGroupContext';
import { useMenuRootContext } from '../root/MenuRootContext';
import { itemMapping } from '../utils/stateAttributesMapping';

import { MenuRadioItemContext } from './MenuRadioItemContext';
/**
 * A menu item that works like a radio button in a given group.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuRadioItem(componentProps: MenuRadioItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        id: idProp,
        label,
        nativeButton = false,
        disabled = false,
        closeOnClick = false,
        value,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp) as string;
    const { store } = useMenuRootContext();
    const group = useMenuRadioGroupContext();
    const setup = useMenuItemSetup();

    const item = useMachine((options) => new MenuRadioItemMachine(store, group, options, setup), {
        id,
        label,
        nativeButton,
        disabled,
        closeOnClick,
        value
    });
    const state: MenuRadioItem.State = useMachineState(item);

    const element = useRenderElement('div', componentProps, {
        state,
        customStyleHookMapping: itemMapping,
        props: [elementProps, (props) => toReactProps(item.getRadioItemProps(props))],
        ref: [ref, item.setElement]
    });

    return <MenuRadioItemContext value={state}>{element}</MenuRadioItemContext>;
}

export type MenuRadioItemState = {
    /**
     * Whether the radio item should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the radio item is currently highlighted.
     */
    highlighted: boolean;
    /**
     * Whether the radio item is currently selected.
     */
    checked: boolean;
};

export type MenuRadioItemProps = {
    /**
     * Value of the radio item.
     * This is the value that will be set in the MenuRadioGroup when the item is selected.
     */
    value: any;
    /**
     * The click handler for the menu item.
     */
    onClick?: React.MouseEventHandler<HTMLElement>;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Overrides the text label to use when the item is matched during keyboard text navigation.
     */
    label?: string;
    /**
     * @ignore
     */
    id?: string;
    /**
     * Whether to close the menu when the item is clicked.
     * @default false
     */
    closeOnClick?: boolean;
} & NonNativeButtonProps &
    HeadlessUIComponentProps<'div', MenuRadioItem.State>;

export namespace MenuRadioItem {
    export type State = MenuRadioItemState;
    export type Props = MenuRadioItemProps;
}
