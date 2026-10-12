import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { MeterPart } from '../root/MeterRootContext';

/**
 * The label of the meter (`aria-labelledby` of the root).
 */
export class MeterLabelElement extends MeterPart.withAttributes({}) {
    private readonly generatedId = createId('meter-label');

    protected override connectParts() {
        const id = this.targetId(this.generatedId);
        this.meter.setLabelId(id);
        return () => this.meter.setLabelId(undefined);
    }

    protected override getProps(): Props {
        return { id: this.targetId(this.generatedId) };
    }
}
