import React from 'react';

import { MenuCheckboxItemMachine } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useMenuItemSetup } from '../item/useMenuItem';
import { useMenuRootContext } from '../root/MenuRootContext';
import { itemMapping } from '../utils/stateAttributesMapping';

import type { MenuRoot } from '../root/MenuRoot';

import { MenuCheckboxItemContext } from './MenuCheckboxItemContext';
/**
 * A menu item that toggles a setting on or off.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuCheckboxItem(componentProps: MenuCheckboxItem.Props) {
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
        closeOnClick = false,
        checked,
        defaultChecked,
        onCheckedChange,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp) as string;
    const { store } = useMenuRootContext();
    const setup = useMenuItemSetup();

    const item = useMachine((options) => new MenuCheckboxItemMachine(store, options, setup), {
        id,
        label,
        nativeButton,
        disabled,
        closeOnClick,
        checked,
        defaultChecked,
        onCheckedChange: onCheckedChange as never
    });
    const state: MenuCheckboxItem.State = useMachineState(item);

    const element = useRenderElement('div', componentProps, {
        state,
        customStyleHookMapping: itemMapping,
        props: [elementProps, (props) => toReactProps(item.getCheckboxItemProps(props))],
        ref: [ref, item.setElement]
    });

    return <MenuCheckboxItemContext value={state}>{element}</MenuCheckboxItemContext>;
}

export type MenuCheckboxItemState = {
    /**
     * Whether the checkbox item should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the checkbox item is currently highlighted.
     */
    highlighted: boolean;
    /**
     * Whether the checkbox item is currently ticked.
     */
    checked: boolean;
};

export type MenuCheckboxItemProps = {
    /**
     * Whether the checkbox item is currently ticked.
     *
     * To render an uncontrolled checkbox item, use the `defaultChecked` prop instead.
     */
    checked?: boolean;
    /**
     * Whether the checkbox item is initially ticked.
     *
     * To render a controlled checkbox item, use the `checked` prop instead.
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * Event handler called when the checkbox item is ticked or unticked.
     */
    onCheckedChange?: (checked: boolean, eventDetails: MenuCheckboxItem.ChangeEventDetails) => void;
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
    HeadlessUIComponentProps<'div', MenuCheckboxItem.State>;

export type MenuCheckboxItemChangeEventReason = MenuRoot.ChangeEventReason;
export type MenuCheckboxItemChangeEventDetails = MenuRoot.ChangeEventDetails;

export namespace MenuCheckboxItem {
    export type State = MenuCheckboxItemState;
    export type Props = MenuCheckboxItemProps;
    export type ChangeEventReason = MenuCheckboxItemChangeEventReason;
    export type ChangeEventDetails = MenuCheckboxItemChangeEventDetails;
}
