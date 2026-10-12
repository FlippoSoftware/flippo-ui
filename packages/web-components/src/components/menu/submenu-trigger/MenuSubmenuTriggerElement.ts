import { MenuSubmenuTriggerMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenuStore } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { MenuItemPart } from '../root/MenuRootContext';

/**
 * The item of a menu that opens a submenu: place it first in a `<prefix>-menu-submenu`.
 *
 * Attributes: `label`, `disabled`, `open-on-hover` (`"false"`: only a press or the keyboard opens it), `delay` (ms; 100
 * by default), `close-delay` (ms).
 * State attributes: `data-popup-open`, `data-highlighted`, `data-disabled`.
 */
export class MenuSubmenuTriggerElement extends MenuItemPart.withAttributes({
    'open-on-hover': 'boolean',
    delay: 'number',
    'close-delay': 'number'
}) {
    protected item!: MenuSubmenuTriggerMachine;

    protected override createParts() {
        const parent = this.root.store.select('parent');
        if (parent.type !== 'menu') {
            throw new Error('Flippo web components: a menu submenu trigger must be placed in a menu submenu.');
        }
        this.item = new MenuSubmenuTriggerMachine(
            this.root.store as MenuStore<unknown>,
            parent.store as MenuStore<unknown>,
            this.getOptions(),
            this.setup
        );
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.item.afterCommit();
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getSubmenuTriggerProps(), MenuSubmenuTriggerMachine.attrs(this.item.getState()));
    }

    private getOptions() {
        return {
            ...this.baseOptions,
            openOnHover: this.openOnHover ?? true,
            delay: this.delay ?? 100,
            closeDelay: this.closeDelay ?? 0
        };
    }
}
