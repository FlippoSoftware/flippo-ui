import { MenuGroupMachine } from '@flippo-software/core-components/menu';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { createId } from '../../../lib/createId';
import { MENU_GROUP } from '../root/MenuRootContext';

abstract class MenuGroupPart extends ContextPart<typeof MENU_GROUP> {
    protected readonly contexts = MENU_GROUP;
}

/**
 * The label of the group around it (`aria-labelledby` of the group).
 */
export class MenuGroupLabelElement extends MenuGroupPart.withAttributes({}) {
    private readonly generatedId = createId('menu-group-label');

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return this.provided[0].machine.registerLabel(this.labelId);
    }

    protected override getProps(): Props {
        return MenuGroupMachine.getLabelProps(this.labelId);
    }

    /**
     * The id of the target: one written by the page is kept, otherwise the generated one is used.
     */
    private get labelId(): string {
        return this.targetId(this.generatedId);
    }
}
