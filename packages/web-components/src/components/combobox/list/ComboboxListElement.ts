import { ComboboxListMachine, ComboboxParts } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { ComboboxListContext, ComboboxPart } from '../root/ComboboxRootContext';

/**
 * The list of the options (`role="listbox"`).
 *
 * State attributes: `data-empty`.
 */
export class ComboboxListElement extends ComboboxPart.withAttributes({}) {
    private list!: ComboboxListMachine;

    constructor() {
        super();
        declareProvider(this, ComboboxListContext);
    }

    get machine(): ComboboxListMachine {
        return this.list;
    }

    protected override createParts() {
        this.list = new ComboboxListMachine(this.root, this.closest('[data-flippo-top-layer]') !== null);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.list.connect();
        const stopProviding = provideContext(this, ComboboxListContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.list?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.list.getListProps(), ComboboxParts.isEmpty(this.root) ? { 'data-empty': '' } : {});
    }
}
