import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { SliderPart } from '../root/SliderRootContext';

/**
 * The part of the track between its start and the thumb (or between the thumbs of a range).
 */
export class SliderIndicatorElement extends SliderPart.withAttributes({}) {
    protected override getProps(): Props {
        return mergeProps(this.slider.getIndicatorProps(true), this.stateAttributes);
    }
}
