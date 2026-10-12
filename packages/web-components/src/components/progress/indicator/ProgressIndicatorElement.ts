import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { ProgressPart } from '../root/ProgressRootContext';

/**
 * The filled part of the track: its width (`inset-inline-start` + `width`) follows the value.
 */
export class ProgressIndicatorElement extends ProgressPart.withAttributes({}) {
    protected override getProps(): Props {
        return mergeProps({ style: this.progress.getIndicatorStyle() }, this.stateAttributes);
    }
}
