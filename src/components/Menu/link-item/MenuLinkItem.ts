'use client';
import * as React from 'react';

import { MenuLinkItemMachine } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuItemSetup } from '../item/useMenuItem';
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

    const id = useHeadlessUiId(idProp) as string;
    const { store } = useMenuRootContext();
    const setup = useMenuItemSetup();

    const item = useMachine((options) => new MenuLinkItemMachine(store, options, setup), { id, label, closeOnClick });
    const link = React.useMemo(() => ({ getState: () => item.getLinkState() }), [item]);
    const state: MenuLinkItem.State = useMachineState(link);

    return useRenderElement('a', componentProps, {
        state,
        props: [elementProps, (props) => toReactProps(item.getLinkProps(props))],
        ref: [ref, item.setElement]
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
