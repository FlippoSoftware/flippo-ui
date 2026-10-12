import { type ContextMenuRootMachine, ContextMenuTriggerMachine } from '@flippo-software/core-components/context-menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { MenuPart } from '../../menu/root/MenuRootContext';
import { ContextMenuElement } from '../root/ContextMenuElement';

/**
 * The area that opens the context menu on a right click or a long press.
 *
 * State attributes: `data-popup-open`.
 */
export class ContextMenuTriggerElement extends MenuPart.withAttributes({}) {
    private trigger!: ContextMenuTriggerMachine;

    private get contextMenu(): ContextMenuRootMachine {
        const root = this.rootElement;
        if (!(root instanceof ContextMenuElement)) {
            throw new Error('Flippo web components: a context menu trigger must be placed in a context menu.');
        }
        return root.contextMachine;
    }

    protected override createParts() {
        this.trigger = new ContextMenuTriggerMachine(this.contextMenu);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        return this.trigger.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.trigger.getTriggerProps(), ContextMenuTriggerMachine.attrs({ open: this.root.store.select('open') }));
    }
}
