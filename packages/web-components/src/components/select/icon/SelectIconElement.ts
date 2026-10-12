import { mergeProps } from '@flippo-software/core-components/props';
import { SelectIcon } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { SelectPart } from '../root/SelectRootContext';

/**
 * An icon that shows that the trigger opens a list (`aria-hidden`).
 *
 * State attributes: `data-popup-open`.
 */
export class SelectIconElement extends SelectPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return mergeProps(SelectIcon.getProps(), SelectIcon.attrs({ open: this.root.store.state.open }));
    }
}
