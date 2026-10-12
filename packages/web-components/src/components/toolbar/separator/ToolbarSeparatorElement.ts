import { getSeparatorProps } from '@flippo-software/core-components/separator';

import type { Props } from '@flippo-software/core-components/props';

import { ToolbarPart } from '../root/ToolbarRootContext';

/**
 * A separator between items, in the orientation of the toolbar.
 */
export class ToolbarSeparatorElement extends ToolbarPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return getSeparatorProps({ orientation: this.toolbar.orientation });
    }
}
