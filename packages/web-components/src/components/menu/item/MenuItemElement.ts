import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { MenuRegularItemMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenuStore } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { MenuItemPart } from '../root/MenuRootContext';

/**
 * An item of the menu: a press runs its action (listen to `click`) and closes the menu.
 *
 * Attributes: `label` (the text matched when typing; the text content by default), `disabled`, `close-on-click`
 * (`"false"` keeps the menu open).
 * State attributes: `data-highlighted`, `data-disabled`.
 */
export class MenuItemElement extends MenuItemPart.withAttributes({
    /**
     * Whether to close the menu when the item is clicked.
     * @default true
     */
    'close-on-click': 'boolean'
}) {
    protected item!: MenuRegularItemMachine;

    protected override createParts() {
        this.item = new MenuRegularItemMachine(this.root.store as MenuStore<unknown>, this.getOptions(), this.setup);
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getItemProps(), getStyleHookProps(this.item.getState()));
    }

    private getOptions() {
        return { ...this.baseOptions, closeOnClick: this.closeOnClick ?? true };
    }
}
