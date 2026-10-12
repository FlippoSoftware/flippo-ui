import { ComboboxParts } from '@flippo-software/core-components/combobox';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * A live region for messages about the list (e.g. the number of results).
 */
export class ComboboxStatusElement extends ComboboxPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return ComboboxParts.getStatusProps();
    }
}
