import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { ProgressPart } from '../root/ProgressRootContext';

/**
 * The label of the progress bar (`aria-labelledby` of the root).
 */
export class ProgressLabelElement extends ProgressPart.withAttributes({}) {
    private readonly generatedId = createId('progress-label');

    protected override connectParts() {
        const id = this.targetId(this.generatedId);
        this.progress.setLabelId(id);
        return () => this.progress.setLabelId(undefined);
    }

    protected override getProps(): Props {
        return mergeProps({ id: this.targetId(this.generatedId) }, this.stateAttributes);
    }
}
