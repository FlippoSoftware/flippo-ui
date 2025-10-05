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
    const { closeParentOnEsc = false } = props;

    return (
        <MenuSubmenuRootContext.Provider value>
            <MenuRoot closeParentOnEsc={closeParentOnEsc} {...props} />
        </MenuSubmenuRootContext.Provider>
    );
}

export namespace MenuSubmenuRoot {
    export type Props = {
        /**
         * Whether the submenu should open when the trigger is hovered.
         * @default true
         */
        openOnHover?: MenuRoot.Props['openOnHover'];
        /**
         * Event handler called when the menu is opened or closed.
         */
        onOpenChange?: (open: boolean, eventDetails: ChangeEventDetails) => void;
    } & Omit<MenuRoot.Props, 'modal' | 'openOnHover' | 'onOpenChange'>;

    export type State = {};

    export type ChangeEventReason = MenuRoot.ChangeEventReason;
    export type ChangeEventDetails = MenuRoot.ChangeEventDetails;
}
