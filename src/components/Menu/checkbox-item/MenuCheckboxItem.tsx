import React from 'react';

import { useControlledState } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { REGULAR_ITEM, useMenuItem } from '../item/useMenuItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
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
        checked: checkedProp,
        defaultChecked,
        onCheckedChange,
        ...elementProps
    } = componentProps;

    const listItem = useCompositeListItem({ label });
    const menuPositionerContext = useMenuPositionerContext(true);
    const id = useHeadlessUiId(idProp);

    const { store } = useMenuRootContext();
    const highlighted = store.useState('isActive', listItem.index);
    const itemProps = store.useState('itemProps');

    const [checked, setChecked] = useControlledState({
        prop: checkedProp,
        defaultProp: defaultChecked ?? false,
        caller: 'MenuCheckboxItem'
    });

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

    const state: MenuCheckboxItem.State = React.useMemo(
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

        onCheckedChange?.(!checked, details);

        if (details.isCanceled) {
            return;
        }

        setChecked((currentlyChecked) => !currentlyChecked);
    });

    const element = useRenderElement('div', componentProps, {
        state,
        customStyleHookMapping: itemMapping,
        props: [itemProps, {
            'role': 'menuitemcheckbox',
            'aria-checked': checked,
            'onClick': handleClick
        }, elementProps, getItemProps],
        ref: [itemRef, ref, listItem.ref]
    });

    return (
        <MenuCheckboxItemContext.Provider value={state}>{element}</MenuCheckboxItemContext.Provider>
    );
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
} & NonNativeButtonProps & HeadlessUIComponentProps<'div', MenuCheckboxItem.State>;

export type MenuCheckboxItemChangeEventReason = MenuRoot.ChangeEventReason;
export type MenuCheckboxItemChangeEventDetails = MenuRoot.ChangeEventDetails;

export namespace MenuCheckboxItem {
    export type State = MenuCheckboxItemState;
    export type Props = MenuCheckboxItemProps;
    export type ChangeEventReason = MenuCheckboxItemChangeEventReason;
    export type ChangeEventDetails = MenuCheckboxItemChangeEventDetails;
}
