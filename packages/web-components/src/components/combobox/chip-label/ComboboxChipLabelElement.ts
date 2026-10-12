import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { ComboboxChipPart, labelOf } from '../root/ComboboxRootContext';

/**
 * The label of the chip's value, as text when the element has no content of its own.
 */
export class ComboboxChipLabelElement extends ComboboxChipPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    protected override createParts() {}

    protected override getProps(): Props {
        this.text.set(labelOf(this.provided[0].machine, this.provided[1].value));
        return {};
    }
}
