import type { MenuItemSetup } from '@flippo-software/core-components/menu';

import { useContextMenuRootContext } from '../../ContextMenu/root/ContextMenuRootContext';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';

/**
 * The setup of a menu item machine: the item registry of the menu's positioner, its floating tree node
 * and the context menu it is in, if any.
 */
export function useMenuItemSetup(): MenuItemSetup {
    const { positioner, nodeId } = useMenuPositionerContext();
    const contextMenu = useContextMenuRootContext(true);
    return { registry: positioner.items, nodeId, contextMenu: contextMenu?.context };
}
