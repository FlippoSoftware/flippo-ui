import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createId } from '../../../lib/createId';
import { COMBOBOX_GROUP } from '../root/ComboboxRootContext';

abstract class ComboboxGroupPart extends ContextPart<typeof COMBOBOX_GROUP> {
    protected readonly contexts = COMBOBOX_GROUP;
}

/**
 * The label of the group around it (`aria-labelledby` of the group).
 */
export class ComboboxGroupLabelElement extends ComboboxGroupPart.withAttributes({}) {
    private readonly generatedId = createId('combobox-group-label');

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return this.provided[0].machine.registerLabel(this.targetId(this.generatedId));
    }

    protected override getProps(): Props {
        return { id: this.targetId(this.generatedId) };
    }
}
