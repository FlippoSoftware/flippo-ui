import { MenuGroupMachine } from '@flippo-software/core-components/menu';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';
import { MenuGroupContext } from '../root/MenuRootContext';

/**
 * Groups related items, labelled by the `<prefix>-menu-group-label` in it.
 */
export class MenuGroupElement extends MachineElement.withAttributes({}) {
    readonly machine = new MenuGroupMachine();

    constructor() {
        super();
        declareProvider(this, MenuGroupContext);
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return provideContext(this, MenuGroupContext, this);
    }

    protected override getProps(): Props {
        return this.machine.getGroupProps();
    }
}
