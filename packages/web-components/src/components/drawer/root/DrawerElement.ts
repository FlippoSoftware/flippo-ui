import { DrawerRootMachine } from '@flippo-software/core-components/drawer';

import type { DialogRootMachine, DialogRootOptions, DialogRootSetup } from '@flippo-software/core-components/dialog';
import type { DrawerRootOptions, DrawerStore, SnapPoint } from '@flippo-software/core-components/drawer';

import { property } from '../../../lib/MachineElement';
import { DialogElement } from '../../dialog/root/DialogElement';

import type { DialogRootDriver } from '../../dialog/root/DialogRootContext';

/**
 * A dialog that slides in from an edge of the screen and can be dragged away: the root of the `-drawer-*` parts
 * (`-drawer-trigger`, `-drawer-close`, `-drawer-title` and `-drawer-description` are those of the dialog).
 *
 * Attributes: those of the dialog, and `direction` (the direction it is swiped to close: `down` by default, `up`,
 * `left`, `right`), `should-drag` (`"false"` disables dragging), `active-snap-point` (controlled index),
 * `should-scale-background`, `background-scale` (0.96).
 * Properties: `snapPoints` (heights where it stops: px numbers, fractions of the container, `"200px"`).
 * Events: those of the dialog, and `snap-point-change` (`detail: { index }`), `drag` (`detail: { offset }`),
 * `drag-end` (`detail: { open }`).
 */
export class DrawerElement extends DialogElement.withAttributes({
    direction: ['down', 'up', 'left', 'right'],
    'should-drag': 'boolean',
    'active-snap-point': 'number',
    'should-scale-background': 'boolean',
    'background-scale': 'number',
    snapPoints: property<SnapPoint[]>()
}) {
    private drawer!: DrawerRootMachine;

    /**
     * The drag and snap state of the drawer.
     */
    get drawerStore(): DrawerStore {
        return this.drawer.drawerStore;
    }

    protected override createRoot(
        options: DialogRootOptions,
        setup: DialogRootSetup<unknown>
    ): { dialog: DialogRootMachine; owner: DialogRootDriver } {
        this.drawer = new DrawerRootMachine(options, setup);
        return { dialog: this.drawer.dialog, owner: this.drawer };
    }

    protected override getOptions(): DrawerRootOptions {
        return {
            ...super.getOptions(),
            direction: this.direction ?? 'down',
            shouldDrag: this.shouldDrag ?? true,
            snapPoints: this.snapPoints,
            activeSnapPoint: this.activeSnapPoint,
            shouldScaleBackground: this.shouldScaleBackground ?? false,
            backgroundScale: this.backgroundScale ?? 0.96,
            onSnapPointChange: (index: number) => {
                this.emit('snap-point-change', { index });
            },
            onDrag: (offset: number) => {
                this.emit('drag', { offset });
            },
            onDragEnd: (details: { open: boolean }) => {
                this.emit('drag-end', details);
            }
        };
    }
}
