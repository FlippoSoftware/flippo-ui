import { DrawerDragMachine } from '@flippo-software/core-components/drawer';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { DialogPart } from '../../dialog/root/DialogRootContext';
import { drawerOf } from '../root/DrawerRootContext';

/**
 * The area that drags the drawer (e.g. a handle); without it, the whole panel does.
 *
 * Attributes: `close-threshold`, `velocity-threshold`.
 * State attributes: `data-dragging`, `data-open`.
 */
export class DrawerDragElement extends DialogPart.withAttributes({
    'close-threshold': 'number',
    'velocity-threshold': 'number'
}) {
    private drag!: DrawerDragMachine;

    protected override createParts() {
        this.drag = new DrawerDragMachine(drawerOf(this.rootElement).drawerStore, this.root.store, this.getOptions());
    }

    protected override applyOptions() {
        this.drag.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.drag.afterCommit();
    }

    protected override connectParts() {
        return this.drag.connect();
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.drag?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.drag.getDragProps(), DrawerDragMachine.attrs(this.drag.getState()));
    }

    private getOptions() {
        return { closeThreshold: this.closeThreshold, velocityThreshold: this.velocityThreshold };
    }
}
