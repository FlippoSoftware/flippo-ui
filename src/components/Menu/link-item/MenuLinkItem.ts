'use client';
import * as React from 'react';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useMenuItemCommonProps } from '../item/useMenuItemCommonProps';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

/**
 * A link in the menu that can be used to navigate to a different page or section.
 * Renders an `<a>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuLinkItem(componentProps: MenuLinkItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        id: idProp,
        label,
        closeOnClick = false,
        ...elementProps
    } = componentProps;

    const linkRef = React.useRef<HTMLAnchorElement | null>(null);

    const listItem = useCompositeListItem({ label });
    const menuPositionerContext = useMenuPositionerContext(true);
    const nodeId = menuPositionerContext?.nodeId;

    const id = useHeadlessUiId(idProp);

    const { store } = useMenuRootContext();
    const highlighted = store.useState('isActive', listItem.index);
    const itemProps = store.useState('itemProps');

    const commonProps = useMenuItemCommonProps({
        closeOnClick,
        highlighted,
        id,
        nodeId,
        store,
        itemRef: linkRef
    });

    const state: MenuLinkItem.State = React.useMemo(
        () => ({
            highlighted
        }),
        [highlighted]
    );

    return useRenderElement('a', componentProps, {
        state,
        props: [itemProps, elementProps, commonProps],
        ref: [linkRef, ref, listItem.ref]
    });
}

export type MenuLinkItemState = {
    /**
     * Whether the item is highlighted.
     */
    highlighted: boolean;
};

export type MenuLinkItemProps = {
    /**
     * Overrides the text label to use when the item is matched during keyboard text navigation.
     */
    label?: string | undefined;
    /**
     * @ignore
     */
    id?: string | undefined;
    /**
     * Whether to close the menu when the item is clicked.
     * @default false
     */
    closeOnClick?: boolean | undefined;
} & HeadlessUIComponentProps<'a', MenuLinkItem.State>;

export namespace MenuLinkItem {
    export type State = MenuLinkItemState;
    export type Props = MenuLinkItemProps;
}
