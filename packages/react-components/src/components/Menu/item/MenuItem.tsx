import type React from 'react';

import { MenuRegularItemMachine } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useMenuRootContext } from '../root/MenuRootContext';

import { useMenuItemSetup } from './useMenuItem';
/**
 * An individual interactive item in the menu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuItem(componentProps: MenuItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        id: idProp,
        label,
        nativeButton = false,
        disabled = false,
        closeOnClick = true,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp) as string;
    const { store } = useMenuRootContext();
    const setup = useMenuItemSetup();

    const item = useMachine((options) => new MenuRegularItemMachine(store, options, setup), {
        id,
        label,
        nativeButton,
        disabled,
        closeOnClick
    });
    const state: MenuItem.State = useMachineState(item);

    return useRenderElement('div', componentProps, {
        state,
        props: [elementProps, (props) => toReactProps(item.getItemProps(props))],
        ref: [ref, item.setElement]
    });
}

export type MenuItemState = {
    /**
     * Whether the item should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the item is highlighted.
     */
    highlighted: boolean;
};

export type MenuItemProps = {
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
     *
     * @default true
     */
    closeOnClick?: boolean;
} & NonNativeButtonProps &
    HeadlessUIComponentProps<'div', MenuItem.State>;

export namespace MenuItem {
    export type State = MenuItemState;
    export type Props = MenuItemProps;
}
