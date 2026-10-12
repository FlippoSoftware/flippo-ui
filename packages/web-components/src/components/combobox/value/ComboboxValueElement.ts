import { ComboboxParts } from '@flippo-software/core-components/combobox';

import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { ComboboxPart, labelOf } from '../root/ComboboxRootContext';

/**
 * The label of the chosen value (or values), as text when the element has no content of its own.
 */
export class ComboboxValueElement extends ComboboxPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        const { selectedValue } = this.root.store.state;
        const label = Array.isArray(selectedValue)
            ? selectedValue.map((value) => labelOf(this.root, value)).join(', ')
            : selectedValue == null
              ? ''
              : String(ComboboxParts.getValueLabel(this.root) ?? '');
        this.text.set(label);
        return {};
    }
}
