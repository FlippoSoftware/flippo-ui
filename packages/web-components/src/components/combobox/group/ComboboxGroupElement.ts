import { ComboboxGroupMachine } from '@flippo-software/core-components/combobox';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { ComboboxGroupContext, ComboboxPart } from '../root/ComboboxRootContext';

/**
 * Groups related options, labelled by the `<prefix>-combobox-group-label` in it.
 */
export class ComboboxGroupElement extends ComboboxPart.withAttributes({}) {
    readonly machine = new ComboboxGroupMachine();

    constructor() {
        super();
        declareProvider(this, ComboboxGroupContext);
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return provideContext(this, ComboboxGroupContext, this);
    }

    protected override getProps(): Props {
        return this.machine.getGroupProps();
    }
}
