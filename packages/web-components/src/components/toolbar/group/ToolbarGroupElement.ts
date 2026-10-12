import { mergeProps } from '@flippo-software/core-components/props';
import { ToolbarGroupMachine, ToolbarMachine } from '@flippo-software/core-components/toolbar';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { ToolbarGroupContext, ToolbarPart } from '../root/ToolbarRootContext';

/**
 * Groups related items; `disabled` disables them.
 *
 * Attributes: `disabled`.
 * State attributes: `data-disabled`, `data-orientation`.
 */
export class ToolbarGroupElement extends ToolbarPart.withAttributes({
    disabled: 'boolean'
}) {
    private group!: ToolbarGroupMachine;

    constructor() {
        super();
        declareProvider(this, ToolbarGroupContext);
    }

    get machine(): ToolbarGroupMachine {
        return this.group;
    }

    protected override createParts() {
        this.group = new ToolbarGroupMachine(this.toolbar, this.disabled ?? false);
    }

    protected override applyOptions() {
        this.group.setDisabled(this.disabled ?? false);
    }

    protected override connectParts() {
        return provideContext(this, ToolbarGroupContext, this);
    }

    protected override getProps(): Props {
        return mergeProps({ role: 'group' }, ToolbarMachine.attrs(this.group.getState()));
    }
}
