import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { PinInputPart } from '../root/PinInputRootContext';

/**
 * Groups the pins (`role="group"`).
 */
export class PinInputGroupElement extends PinInputPart.withAttributes({}) {
    protected override getProps(): Props {
        return mergeProps(this.pinInput.getGroupProps(), this.stateAttributes);
    }
}
