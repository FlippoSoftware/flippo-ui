import { mergeProps } from '@flippo-software/core-components/props';
import { SelectItemIndicatorMachine } from '@flippo-software/core-components/select';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { SelectItemPart } from '../root/SelectRootContext';

/**
 * Shows whether the item is selected: hidden while it is not (unless `keep-mounted`).
 *
 * Attributes: `keep-mounted`.
 * State attributes: `data-selected`, transition attributes.
 */
export class SelectItemIndicatorElement extends SelectItemPart.withAttributes({
    /** Whether to keep the HTML element in the DOM when the item is not selected. */
    'keep-mounted': 'boolean'
}) {
    private indicator!: SelectItemIndicatorMachine;

    protected override createParts() {
        this.indicator = new SelectItemIndicatorMachine(untracked(() => this.item.selected));
    }

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
        return mergeProps(this.indicator.getProps(), SelectItemIndicatorMachine.attrs(this.indicator.getState()), {
            hidden: !this.indicator.shouldRender(this.keepMounted ?? false)
        });
    }
}
