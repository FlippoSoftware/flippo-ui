'use client';

import React from 'react';

import { MenuRoot } from '../root/MenuRoot';

import { MenuSubmenuRootContext } from './MenuSubmenuRootContext';

/**
 * Groups all parts of a submenu.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuSubmenuRoot(props: MenuSubmenuRoot.Props) {
    return (
        <MenuSubmenuRootContext value>
            <MenuRoot {...props} />
        </MenuSubmenuRootContext>
    );
}

export namespace MenuSubmenuRoot {
    export type State = object;

    export type Props = {
    /**
     * Whether the submenu should open when the trigger is hovered.
     * @default true
     */
        openOnHover?: MenuRoot.Props['openOnHover'];
    } & Omit<MenuRoot.Props, 'modal' | 'openOnHover'>;
}
