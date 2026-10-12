import type { MenuParent } from '@flippo-software/core-components/menu';

import { requestAncestorContext } from '../../../lib/context';
import { MenuElement } from '../root/MenuElement';
import { MenuContext } from '../root/MenuRootContext';

/**
 * A menu opened by an item of another menu, inside the popup of that menu: its trigger is a
 * `<prefix>-menu-submenu-trigger`. Same attributes and events as the menu (`modal` excepted).
 */
export class MenuSubmenuElement extends MenuElement {
    private parentMenu: MenuElement | undefined;

    private cancelParentRequest: (() => void) | null = null;

    /**
     * Waits for the menu it is nested in (it may connect after its children).
     */
    protected override whenReady(callback: () => void) {
        this.cancelParentRequest?.();
        this.cancelParentRequest = requestAncestorContext(this, MenuContext, MenuElement, (parent) => {
            this.cancelParentRequest = null;
            if (!parent) {
                throw new Error('Flippo web components: a menu submenu must be placed in the popup of a menu.');
            }
            this.parentMenu = parent;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelParentRequest?.();
        this.cancelParentRequest = null;
        super.disconnectedCallback();
    }

    protected override getParent(): MenuParent {
        return this.parentMenu ? { type: 'menu', store: this.parentMenu.machine.store } : { type: undefined };
    }
}
