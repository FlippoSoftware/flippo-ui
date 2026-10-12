import { ComboboxItemMachine } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContext } from '../../../lib/context';
import { ComboboxListElement } from '../list/ComboboxListElement';
import { ComboboxItemContext, ComboboxListContext, ComboboxPart } from '../root/ComboboxRootContext';

/**
 * An option of the list. Filtered out by the text, it is hidden (and out of the list).
 *
 * Attributes: `value` (required), `label` (the text matched and filled in the input; the item's text by default),
 * `disabled`.
 * State attributes: `data-selected`, `data-highlighted`, `data-disabled`.
 */
export class ComboboxItemElement extends ComboboxPart.withAttributes({
    value: 'string',
    label: 'string',
    disabled: 'boolean'
}) {
    private item!: ComboboxItemMachine;

    private list: ComboboxListElement | undefined;

    private cancelListRequest: (() => void) | null = null;

    constructor() {
        super();
        declareProvider(this, ComboboxItemContext);
    }

    get machine(): ComboboxItemMachine {
        return this.item;
    }

    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            this.cancelListRequest?.();
            this.cancelListRequest = requestAncestorContext(this, ComboboxListContext, ComboboxListElement, (list) => {
                this.cancelListRequest = null;
                this.list = list;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelListRequest?.();
        this.cancelListRequest = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        const inRow = this.parentElement?.closest('[role="row"]') !== null;
        this.item = new ComboboxItemMachine(this.root, this.getOptions(), { registry: this.list?.machine.registry ?? null, inRow });
    }

    protected override applyOptions() {
        this.item.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.item.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.item.connect();
        const stopProviding = provideContext(this, ComboboxItemContext, this);
        // An option of the document: the root lists it (its value and its label).
        const stopRegistering = effect(() => {
            const { value } = this;
            const label = this.label ?? this.textContent?.trim() ?? '';
            if (!this.rootElement.usesDocumentItems) {
                return;
            }
            return untracked(() => this.rootElement.registerItem(value ?? null, label));
        });
        // Filtered out: out of the list, like an unmounted item.
        const stopFiltering = effect(() => {
            const visible = this.isVisible();
            untracked(() => this.item.setElement(visible ? this.target : null));
        });
        return () => {
            stopFiltering();
            stopRegistering();
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        if (this.item) {
            this.item.setElement(element && this.isVisible() ? element : null);
        }
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getItemProps(), ComboboxItemMachine.attrs(this.item.getState()), { hidden: !this.isVisible() });
    }

    /**
     * Whether the item matches the text (always, with `items` set: the page renders the filtered ones).
     */
    private isVisible(): boolean {
        if (!this.rootElement.usesDocumentItems) {
            return true;
        }
        const { flatFilteredItems } = this.root.derived.state;
        const { isItemEqualToValue } = this.root.store.state;
        const value = this.value ?? null;
        return flatFilteredItems.some((item) => isItemEqualToValue(item, value));
    }

    private getOptions() {
        return { value: this.value ?? null, disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
