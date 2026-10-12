import { MenuCheckboxItemMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenuChangeEventDetails, MenuStore } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MenuCheckableItemContext, type MenuCheckedChangeDetail, MenuItemPart } from '../root/MenuRootContext';

/**
 * An item that toggles a setting; the menu stays open.
 *
 * Attributes: `label`, `disabled`, `checked` (controlled), `default-checked`, `close-on-click`.
 * Events: `checked-change` (cancelable; `detail: { checked, reason }`).
 * State attributes: `data-checked`/`data-unchecked`, `data-highlighted`, `data-disabled`.
 */
export class MenuCheckboxItemElement extends MenuItemPart.withAttributes({
    checked: 'boolean',
    'default-checked': 'boolean',
    'close-on-click': 'boolean'
}) {
    protected item!: MenuCheckboxItemMachine;

    constructor() {
        super();
        declareProvider(this, MenuCheckableItemContext);
    }

    /**
     * The state the indicator follows.
     */
    get itemState() {
        return this.item.getState();
    }

    protected override createParts() {
        this.item = new MenuCheckboxItemMachine(this.root.store as MenuStore<unknown>, this.getOptions(), this.setup);
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = super.connectParts();
        const stopProviding = provideContext(this, MenuCheckableItemContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getCheckboxItemProps(), MenuCheckboxItemMachine.attrs(this.item.getState()));
    }

    private getOptions() {
        return {
            ...this.baseOptions,
            checked: this.checked,
            defaultChecked: this.defaultChecked ?? false,
            closeOnClick: this.closeOnClick ?? false,
            onCheckedChange: (checked: boolean, eventDetails: MenuChangeEventDetails) => {
                this.emit('checked-change', { checked, reason: eventDetails.reason } satisfies MenuCheckedChangeDetail, eventDetails);
            }
        };
    }
}
