import { SelectGroupMachine } from '@flippo-software/core-components/select';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { SelectGroupContext, SelectPart } from '../root/SelectRootContext';

/**
 * Groups related items, labelled by the `<prefix>-select-group-label` in it.
 */
export class SelectGroupElement extends SelectPart.withAttributes({}) {
    readonly machine = new SelectGroupMachine();

    constructor() {
        super();
        declareProvider(this, SelectGroupContext);
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return provideContext(this, SelectGroupContext, this);
    }

    protected override getProps(): Props {
        return this.machine.getGroupProps();
    }
}
