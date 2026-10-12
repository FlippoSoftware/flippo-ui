import { ComboboxItemIndicatorMachine, type ComboboxItemMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { COMBOBOX_ITEM } from '../root/ComboboxRootContext';

abstract class ComboboxItemPart extends ContextPart<typeof COMBOBOX_ITEM> {
    protected readonly contexts = COMBOBOX_ITEM;
}

/**
 * Shows whether the item is selected: hidden while it is not (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: `data-selected`, transition attributes.
 */
export class ComboboxItemIndicatorElement extends ComboboxItemPart.withAttributes({
    'keep-mounted': 'boolean'
}) {
    private indicator!: ComboboxItemIndicatorMachine;

    private get item(): ComboboxItemMachine {
        return this.provided[0].machine;
    }

    protected override createParts() {
        this.indicator = new ComboboxItemIndicatorMachine(untracked(() => this.item.selected));
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.indicator.connect();
        const stop = effect(() => {
            const { selected } = this.item;
            untracked(() => this.indicator.setSelected(selected));
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
        return mergeProps(this.indicator.getProps(), {
            hidden: !this.indicator.shouldRender(this.keepMounted ?? false),
            'data-selected': this.item.selected ? '' : undefined
        });
    }
}
