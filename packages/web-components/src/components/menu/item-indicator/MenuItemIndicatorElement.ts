import { MenuItemIndicatorMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { MENU_CHECKABLE_ITEM, type MenuCheckableItem } from '../root/MenuRootContext';

abstract class MenuCheckablePart extends ContextPart<typeof MENU_CHECKABLE_ITEM> {
    protected readonly contexts = MENU_CHECKABLE_ITEM;
}

/**
 * Shows whether the checkbox or radio item around it is checked: hidden while unchecked (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: `data-checked`/`data-unchecked`, `data-highlighted`, `data-disabled`, transition attributes.
 */
export class MenuItemIndicatorElement extends MenuCheckablePart.withAttributes({
    /**
     * Whether to keep the indicator in the DOM while the item is unchecked.
     * @default false
     */
    'keep-mounted': 'boolean'
}) {
    private indicator!: MenuItemIndicatorMachine;

    private get item(): MenuCheckableItem {
        return this.provided[0];
    }

    protected override createParts() {
        this.indicator = new MenuItemIndicatorMachine(untracked(() => this.item.itemState.checked));
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.indicator.connect();
        const stop = effect(() => {
            const { checked } = this.item.itemState;
            untracked(() => this.indicator.setChecked(checked));
        });
        return () => {
            stop();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.indicator?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(
            this.indicator.getProps({ hidden: !this.indicator.shouldRender(this.keepMounted ?? false) }),
            MenuItemIndicatorMachine.attrs(this.indicator.getState(this.item.itemState))
        );
    }
}
