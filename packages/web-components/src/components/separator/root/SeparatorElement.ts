import { getSeparatorProps } from '@flippo-software/core-components/separator';

import type { Props } from '@flippo-software/core-components/props';

import { MachineElement } from '../../../lib/MachineElement';

/**
 * A line separating content.
 *
 * Attributes: `orientation` (`horizontal` by default, `vertical`).
 * State attributes: `data-orientation`.
 */
export class SeparatorElement extends MachineElement.withAttributes({
    orientation: ['horizontal', 'vertical']
}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        return getSeparatorProps({ orientation: this.orientation ?? 'horizontal' });
    }
}
