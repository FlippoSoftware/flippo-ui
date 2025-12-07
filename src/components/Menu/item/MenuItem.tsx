import React from 'react';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import { REGULAR_ITEM, useMenuItem } from './useMenuItem';

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

    const listItem = useCompositeListItem({ label });
    const menuPositionerContext = useMenuPositionerContext(true);
    const id = useHeadlessUiId(idProp);

    const { store } = useMenuRootContext();
    const highlighted = store.useState('isActive', listItem.index);
    const itemProps = store.useState('itemProps');

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

    const state: MenuItem.State = React.useMemo(
        () => ({
            disabled,
            highlighted
        }),
        [disabled, highlighted]
    );

    return useRenderElement('div', componentProps, {
        state,
        props: [itemProps, elementProps, getItemProps],
        ref: [itemRef, ref, listItem.ref]
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
} & NonNativeButtonProps & HeadlessUIComponentProps<'div', MenuItem.State>;

export namespace MenuItem {
    export type State = MenuItemState;
    export type Props = MenuItemProps;
}
