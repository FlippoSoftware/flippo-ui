import { SelectGroupMachine } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createId } from '../../../lib/createId';
import { SELECT_GROUP } from '../root/SelectRootContext';

abstract class SelectGroupPart extends ContextPart<typeof SELECT_GROUP> {
    protected readonly contexts = SELECT_GROUP;
}

/**
 * The label of the group around it (`aria-labelledby` of the group).
 */
export class SelectGroupLabelElement extends SelectGroupPart.withAttributes({}) {
    private readonly generatedId = createId('select-group-label');

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return this.provided[0].machine.registerLabel(this.targetId(this.generatedId));
    }

    protected override getProps(): Props {
        return SelectGroupMachine.getLabelProps(this.targetId(this.generatedId));
    }
}
