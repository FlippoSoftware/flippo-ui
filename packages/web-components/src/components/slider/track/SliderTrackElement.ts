import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { SliderPart } from '../root/SliderRootContext';

/**
 * The track along which the thumbs move.
 */
export class SliderTrackElement extends SliderPart.withAttributes({}) {
    protected override getProps(): Props {
        return mergeProps({ style: { position: 'relative' } }, this.stateAttributes);
    }
}
