import { mergeProps } from '@flippo-software/core-components/props';
import { SelectItemMachine } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { SelectItemContext, SelectPositionedPart } from '../root/SelectRootContext';

/**
 * An option of the list.
 *
 * Attributes: `value` (required), `label` (the text matched when typing, and shown in the value; by default the text of
 * its `<prefix>-select-item-text`, or of the item), `disabled`.
 * State attributes: `data-selected`, `data-highlighted`, `data-disabled`.
 */
export class SelectItemElement extends SelectPositionedPart.withAttributes({
    value: 'string',
    label: 'string',
    disabled: 'boolean'
}) {
    private item!: SelectItemMachine;

    constructor() {
        super();
        declareProvider(this, SelectItemContext);
    }

    get machine(): SelectItemMachine {
        return this.item;
    }

    /**
     * The text element of the item changed: its text is the default label.
     */
    textChanged() {
        this.invalidateOptions();
    }

    protected override createParts() {
        this.item = new SelectItemMachine(this.root, this.positionerElement.machine.items, this.getOptions());
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.item.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.item.connect();
        const stopProviding = provideContext(this, SelectItemContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getItemProps(), SelectItemMachine.attrs(this.item.getState()));
    }

    private getOptions() {
        return {
            value: this.value ?? null,
            // The text of the item's text element, rather than of the whole item (indicators…).
            label: this.label ?? this.item?.textRef.current?.textContent?.trim(),
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button'
        };
    }
}
