import React from 'react';

import { ContextMenuRootMachine } from '@flippo-software/core-components/context-menu';

import type { MenuParent } from '@flippo-software/core-components/menu';

import { useMachine } from '~@lib/core';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';

import { getMenuRootOptions, MenuRootProvider, useMenuRootSetup } from '../../Menu/root/MenuRoot';

import type { Menu } from '../../Menu';
import type { MenuRoot } from '../../Menu/root/MenuRoot';

import { ContextMenuRootContext } from './ContextMenuRootContext';

/**
 * A component that creates a context menu activated by right clicking or long pressing.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Context Menu](https://base-ui.com/react/components/context-menu)
 */
export function ContextMenuRoot(props: ContextMenuRoot.Props) {
    const setup = useMenuRootSetup();
    const contextMenu = useMachine((options) => new ContextMenuRootMachine(options, setup), getMenuRootOptions(props as MenuRoot.Props));

    const parent: MenuParent = React.useMemo(() => ({ type: 'context-menu', context: contextMenu.context }), [contextMenu]);

    return (
        <ContextMenuRootContext value={contextMenu}>
            <MenuRootProvider root={contextMenu.menu} parent={parent} actionsRef={props.actionsRef}>
                {props.children}
            </MenuRootProvider>
        </ContextMenuRootContext>
    );
}

export type ContextMenuRootState = {};

export type ContextMenuRootProps = {
    /**
     * Event handler called when the menu is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: ContextMenuRoot.ChangeEventDetails) => void;
} & Omit<Menu.Root.Props, 'modal' | 'openOnHover' | 'delay' | 'closeDelay' | 'onOpenChange'>;

export type ContextMenuRootChangeEventReason = MenuRoot.ChangeEventReason;
export type ContextMenuRootChangeEventDetails = HeadlessUIChangeEventDetails<ContextMenuRoot.ChangeEventReason>;

export namespace ContextMenuRoot {
    export type State = ContextMenuRootState;
    export type Props = ContextMenuRootProps;
    export type ChangeEventReason = ContextMenuRootChangeEventReason;
    export type ChangeEventDetails = ContextMenuRootChangeEventDetails;
}
