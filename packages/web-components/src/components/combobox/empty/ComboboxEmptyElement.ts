import { ComboboxParts } from '@flippo-software/core-components/combobox';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ComboboxPart } from '../root/ComboboxRootContext';

/**
 * Shown while no option matches the text (a live region).
 */
export class ComboboxEmptyElement extends ComboboxPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override onTargetChange(element: HTMLElement | null) {
        if (this.provided) {
            ComboboxParts.setEmptyElement(this.root, element as HTMLDivElement | null);
        }
    }

    protected override getProps(): Props {
        return mergeProps(ComboboxParts.getEmptyProps(this.root), { hidden: !ComboboxParts.isEmpty(this.root) });
    }
}
