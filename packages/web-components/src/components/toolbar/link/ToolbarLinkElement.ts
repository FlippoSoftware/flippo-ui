import { mergeProps } from '@flippo-software/core-components/props';
import { ToolbarLinkMachine } from '@flippo-software/core-components/toolbar';

import type { Props } from '@flippo-software/core-components/props';

import { ToolbarPart } from '../root/ToolbarRootContext';

/**
 * A link of the toolbar: put it on an `<a>` with `as-child`.
 *
 * State attributes: `data-orientation`.
 */
export class ToolbarLinkElement extends ToolbarPart.withAttributes({}) {
    private item!: ToolbarLinkMachine;

    protected override createParts() {
        this.item = new ToolbarLinkMachine(this.toolbar);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        return this.item.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.item.getProps(), { 'data-orientation': this.toolbar.orientation });
    }
}
