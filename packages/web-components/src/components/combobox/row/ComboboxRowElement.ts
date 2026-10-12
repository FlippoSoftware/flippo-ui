import { ComboboxParts } from '@flippo-software/core-components/combobox';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * A row of options, in a `grid` combobox.
 */
export class ComboboxRowElement extends ComboboxPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return ComboboxParts.getRowProps();
    }
}
