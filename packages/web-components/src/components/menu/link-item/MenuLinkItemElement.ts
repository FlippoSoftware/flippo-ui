import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { MenuLinkItemMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenuStore } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { MenuItemPart } from '../root/MenuRootContext';

/**
 * A link in the menu: put it on an `<a>` with `as-child`.
 *
 * Attributes: `label`, `close-on-click`.
 * State attributes: `data-highlighted`.
 */
export class MenuLinkItemElement extends MenuItemPart.withAttributes({
    /**
     * Whether a click on the link closes the menu.
     * @default false
     */
    'close-on-click': 'boolean'
}) {
    protected item!: MenuLinkItemMachine;

    protected override createParts() {
        this.item = new MenuLinkItemMachine(this.root.store as MenuStore<unknown>, this.getOptions(), this.setup);
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getLinkProps(), getStyleHookProps(this.item.getLinkState()));
    }

    private getOptions() {
        return { ...this.baseOptions, closeOnClick: this.closeOnClick ?? false };
    }
}
