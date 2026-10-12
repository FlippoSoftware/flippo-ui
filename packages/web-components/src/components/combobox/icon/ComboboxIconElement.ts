import { ComboboxParts } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * An icon that shows that the combobox opens a list (`aria-hidden`).
 */
export class ComboboxIconElement extends ComboboxPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return mergeProps(ComboboxParts.getIconProps(), this.root.store.state.open ? { 'data-popup-open': '' } : {});
    }
}
