import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { ProgressPart } from '../root/ProgressRootContext';

/**
 * The formatted value, as text (when the element has no content of its own).
 */
export class ProgressValueElement extends ProgressPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    protected override getProps(): Props {
        this.text.set(this.progress.getValueText().display);
        return mergeProps({ 'aria-hidden': true }, this.stateAttributes);
    }
}
