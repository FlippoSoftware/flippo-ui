import { ContextMenuRootMachine } from '@flippo-software/core-components/context-menu';

import type { MenuRootMachine, MenuRootOptions, MenuRootSetup } from '@flippo-software/core-components/menu';

import { MenuElement } from '../../menu/root/MenuElement';

import type { MenuRootDriver } from '../../menu/root/MenuRootContext';

/**
 * A menu opened at the pointer by a right click (or a long press) on its trigger area. Same parts as the menu
 * (`<prefix>-menu-positioner`, `-menu-popup`, `-menu-item`…), with a `<prefix>-context-menu-trigger` area.
 *
 * Attributes and events: those of the menu (`modal` excepted).
 */
export class ContextMenuElement extends MenuElement {
    private contextMenu!: ContextMenuRootMachine;

    /**
     * The machine of the context menu (the anchor at the pointer, the long press).
     */
    get contextMachine(): ContextMenuRootMachine {
        return this.contextMenu;
    }

    protected override isNested(): boolean {
        return true;
    }

    protected override createRoot(
        options: MenuRootOptions,
        setup: MenuRootSetup<unknown>
    ): { menu: MenuRootMachine; owner: MenuRootDriver } {
        this.contextMenu = new ContextMenuRootMachine(options, setup);
        return { menu: this.contextMenu.menu, owner: this.contextMenu };
    }
}
