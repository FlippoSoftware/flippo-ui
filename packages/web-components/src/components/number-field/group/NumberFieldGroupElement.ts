import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { NumberFieldPart } from '../root/NumberFieldRootContext';

/**
 * Groups the input and the buttons.
 */
export class NumberFieldGroupElement extends NumberFieldPart.withAttributes({}) {
    protected override getProps(): Props {
        return mergeProps({ role: 'group' }, this.stateAttributes);
    }
}
