import { MenuRadioItemMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenuStore } from '@flippo-software/core-components/menu';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestContext } from '../../../lib/context';
import { MenuCheckableItemContext, MenuItemPart, MenuRadioGroupContext } from '../root/MenuRootContext';

import type { MenuRadioGroupElement } from '../radio-group/MenuRadioGroupElement';

/**
 * An item of a radio group; the menu stays open.
 *
 * Attributes: `value` (required), `label`, `disabled`, `close-on-click`.
 * State attributes: `data-checked`/`data-unchecked`, `data-highlighted`, `data-disabled`.
 */
export class MenuRadioItemElement extends MenuItemPart.withAttributes({
    /**
     * Value of the radio item.
     * This is the value that will be set in the MenuRadioGroup when the item is selected.
     */
    value: 'string',
    /**
     * Whether to close the menu when the item is clicked.
     * @default false
     */
    'close-on-click': 'boolean'
}) {
    protected item!: MenuRadioItemMachine;

    private radioGroup!: MenuRadioGroupElement;

    private cancelGroupRequest: (() => void) | null = null;

    constructor() {
        super();
        declareProvider(this, MenuCheckableItemContext);
    }

    get itemState() {
        return this.item.getState();
    }

    /**
     * After the menu: waits for its radio group.
     */
    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            this.cancelGroupRequest?.();
            this.cancelGroupRequest = requestContext(this, MenuRadioGroupContext, (group) => {
                this.cancelGroupRequest = null;
                this.radioGroup = group;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelGroupRequest?.();
        this.cancelGroupRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.item = new MenuRadioItemMachine(this.root.store as MenuStore<unknown>, this.radioGroup.machine, this.getOptions(), this.setup);
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
        return mergeProps(this.item.getRadioItemProps(), MenuRadioItemMachine.attrs(this.item.getState()));
    }

    private getOptions() {
        return { ...this.baseOptions, value: this.value ?? '', closeOnClick: this.closeOnClick ?? false };
    }
}
