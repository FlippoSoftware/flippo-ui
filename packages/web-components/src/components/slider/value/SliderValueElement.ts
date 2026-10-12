import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { SliderPart } from '../root/SliderRootContext';

/**
 * The formatted value (or values), as text when the element has no content of its own.
 */
export class SliderValueElement extends SliderPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    protected override getProps(): Props {
        this.text.set(String(this.slider.getDefaultDisplayValue()));
        return mergeProps({ 'aria-live': 'off' }, this.stateAttributes);
    }
}
