import type { Props } from '@flippo-software/core-components/props';

import { ProgressPart } from '../root/ProgressRootContext';

/**
 * The track of the bar, containing the indicator.
 */
export class ProgressTrackElement extends ProgressPart.withAttributes({}) {
    protected override getProps(): Props {
        return this.stateAttributes;
    }
}
