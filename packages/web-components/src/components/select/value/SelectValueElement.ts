import { SelectValue } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { SelectPart } from '../root/SelectRootContext';

/**
 * The label of the chosen value (or values), as text when the element has no content of its own; the `placeholder`
 * while nothing is chosen. Labels come from the root's `items`, or else from the items' text.
 *
 * Attributes: `placeholder`.
 * State attributes: `data-placeholder`.
 */
export class SelectValueElement extends SelectPart.withAttributes({
    /**
     * The placeholder value to display when no value is selected.
     * This is overridden by `children` if specified, or by a null item's label in `items`.
     */
    placeholder: 'string'
}) {
    private readonly text = new FallbackText(this);

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        if (this.provided) {
            SelectValue.setElement(this.root, element);
        }
    }

    protected override getProps(): Props {
        const { root } = this;
        const resolved = SelectValue.resolve(root, { hasChildren: false, hasPlaceholder: this.placeholder !== undefined });
        if (resolved.kind === 'placeholder') {
            this.text.set(this.placeholder);
        } else if (resolved.kind === 'labels') {
            this.text.set(resolved.labels.map((label, index) => this.toLabel(label, index)).join(', '));
        } else if (resolved.kind === 'label') {
            this.text.set(this.toLabel(resolved.label));
        }
        return SelectValue.attrs(SelectValue.getState(root));
    }

    /**
     * Without `items`, a value is shown with the text of its item.
     */
    private toLabel(label: unknown, index?: number): string {
        const { state } = this.root.store;
        // The items register their labels: the selected index changes when they do.
        state.selectedIndex;
        if (state.items !== undefined || label == null) {
            return label == null ? '' : String(label);
        }
        const value = index === undefined ? state.value : (state.value as unknown[])[index];
        const { valuesRef, labelsRef } = this.root.refs;
        const itemIndex = valuesRef.current.findIndex((itemValue) => state.isItemEqualToValue(itemValue, value));
        return labelsRef.current[itemIndex] ?? String(label);
    }
}
