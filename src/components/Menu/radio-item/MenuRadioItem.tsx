import React from 'react';

import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { REGULAR_ITEM, useMenuItem } from '../item/useMenuItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
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
        disabled: disabledProp = false,
        closeOnClick = false,
        value,
        ref,
        ...elementProps
    } = componentProps;

    const listItem = useCompositeListItem({ label });
    const menuPositionerContext = useMenuPositionerContext(true);
    const id = useHeadlessUiId(idProp);

    const { store } = useMenuRootContext();
    const highlighted = store.useState('isActive', listItem.index);
    const itemProps = store.useState('itemProps');

    const {
        value: selectedValue,
        setValue: setSelectedValue,
        disabled: groupDisabled
    } = useMenuRadioGroupContext();

    const disabled = groupDisabled || disabledProp;
    const checked = selectedValue === value;

    const { getItemProps, itemRef } = useMenuItem({
        closeOnClick,
        disabled,
        highlighted,
        id,
        store,
        nativeButton,
        nodeId: menuPositionerContext?.nodeId,
        itemMetadata: REGULAR_ITEM
    });

    const state: MenuRadioItem.State = React.useMemo(
        () => ({
            disabled,
            highlighted,
            checked
        }),
        [disabled, highlighted, checked]
    );

    const handleClick = useStableCallback((event: React.MouseEvent) => {
        const details = {
            ...createChangeEventDetails(REASONS.itemPress, event.nativeEvent),
            preventUnmountOnClose: () => {}
        };
        setSelectedValue(value, details);
    });

    const element = useRenderElement('div', componentProps, {
        state,
        customStyleHookMapping: itemMapping,
        props: [itemProps, {
            'role': 'menuitemradio',
            'aria-checked': checked,
            'onClick': handleClick
        }, elementProps, getItemProps],
        ref: [itemRef, ref, listItem.ref]
    });

    return <MenuRadioItemContext.Provider value={state}>{element}</MenuRadioItemContext.Provider>;
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
} & NonNativeButtonProps & HeadlessUIComponentProps<'div', MenuRadioItem.State>;

export namespace MenuRadioItem {
    export type State = MenuRadioItemState;
    export type Props = MenuRadioItemProps;
}
