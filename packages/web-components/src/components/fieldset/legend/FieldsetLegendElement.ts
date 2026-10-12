import { FieldsetMachine } from '@flippo-software/core-components/fieldset';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createId } from '../../../lib/createId';
import { FIELDSET } from '../root/FieldsetRootContext';

abstract class FieldsetPart extends ContextPart<typeof FIELDSET> {
    protected readonly contexts = FIELDSET;
}

/**
 * The label of the fieldset (`aria-labelledby` of the fieldset).
 *
 * State attributes: `data-disabled`.
 */
export class FieldsetLegendElement extends FieldsetPart.withAttributes({}) {
    private readonly generatedId = createId('fieldset-legend');

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        const fieldset = this.provided[0].machine;
        fieldset.setLegendId(this.targetId(this.generatedId));
        return () => fieldset.setLegendId(undefined);
    }

    protected override getProps(): Props {
        const fieldset = this.provided[0].machine;
        return FieldsetMachine.legendAttrs(fieldset.getState(), this.targetId(this.generatedId));
    }
}
