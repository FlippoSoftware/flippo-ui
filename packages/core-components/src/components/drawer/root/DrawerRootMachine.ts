import { untracked } from '@flippo-software/store';

import { DialogRootMachine } from '~@components/dialog/root/DialogRootMachine';
import { Connectable } from '~@lib/Connectable';

import type { DialogRootOptions, DialogRootSetup } from '~@components/dialog/root/DialogRootMachine';
import type { DialogStore } from '~@components/dialog/store/DialogStore';
import type { MutableRef } from '~@lib/types';

import { DrawerStore } from '../store/DrawerStore';
import { getDrawerDataAttributes } from '../utils/getDrawerDataAttributes';

import type { DrawerDirection, SnapPoint } from '../store/DrawerStore';

export type DrawerRootOptions = DialogRootOptions & {
    /**
     * @default 'down'
     */
    direction?: DrawerDirection | undefined;
    /**
     * @default true
     */
    shouldDrag?: boolean | undefined;
    snapPoints?: SnapPoint[] | undefined;
    /**
     * Controlled index of the active snap point.
     */
    activeSnapPoint?: number | undefined;
    onSnapPointChange?: ((index: number) => void) | undefined;
    /**
     * @default false
     */
    shouldScaleBackground?: boolean | undefined;
    /**
     * @default 0.96
     */
    backgroundScale?: number | undefined;
    onDrag?: ((offset: number) => void) | undefined;
    onDragEnd?: ((details: { open: boolean }) => void) | undefined;
    containerRef?: MutableRef<HTMLElement | null> | undefined;
};

/**
 * State machine of `Drawer.Root`: a dialog plus the drag/snap state in a {@link DrawerStore}.
 */
export class DrawerRootMachine<Payload = unknown> extends Connectable {
    readonly drawerStore: DrawerStore;

    readonly dialog: DialogRootMachine<Payload>;

    private dataAttributesKey: string | null = null;

    constructor(options: DrawerRootOptions, setup: DialogRootSetup<Payload>) {
        super();
        this.drawerStore = DrawerStore.create({
            direction: 'down',
            shouldDrag: true,
            isDragging: false,
            dragOffset: 0,
            snapPoints: [],
            activeSnapPointIndex: 0,
            shouldScaleBackground: false,
            backgroundScale: 0.96,
            popupStyle: {},
            popupDataAttributes: getDrawerDataAttributes(false, 'down')
        });
        this.syncDrawer(options);
        this.dialog = new DialogRootMachine<Payload>(this.getDialogOptions(options), setup);
    }

    get store(): DialogStore<Payload> {
        return this.dialog.store;
    }

    setOptions(options: DrawerRootOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.syncDrawer(options);
            this.dialog.setOptions(this.getDialogOptions(options));
        });
    }

    /**
     * Applies the dialog's side effects after a commit.
     */
    afterCommit() {
        this.dialog.afterCommit();
    }

    protected override onConnect() {
        this.connectChild(this.dialog);
    }

    private getDialogOptions(options: DrawerRootOptions): DialogRootOptions {
        const { onOpenChange } = options;
        return {
            ...options,
            onOpenChange: (open, details) => {
                onOpenChange?.(open, details);
                if (!open) {
                    this.drawerStore.setActiveSnapPoint(0);
                }
            }
        };
    }

    private syncDrawer(options: DrawerRootOptions) {
        const {
            direction = 'down',
            shouldDrag = true,
            snapPoints = [],
            shouldScaleBackground = false,
            backgroundScale = 0.96,
            containerRef,
            activeSnapPoint,
            onDrag,
            onSnapPointChange,
            onDragEnd
        } = options;
        const store = this.drawerStore;

        store.syncControlledValue('activeSnapPointIndex', activeSnapPoint);
        store.update({
            direction,
            shouldDrag,
            snapPoints,
            shouldScaleBackground,
            backgroundScale,
            containerRef
        });

        // Initial attributes based on the direction so that CSS selectors work before the first drag
        // (reset only when they change: the gesture updates them while dragging).
        const hasSnapPoints = snapPoints.length > 0;
        const dataAttributesKey = `${direction}:${hasSnapPoints}`;
        if (dataAttributesKey !== this.dataAttributesKey) {
            this.dataAttributesKey = dataAttributesKey;
            store.set('popupDataAttributes', getDrawerDataAttributes(hasSnapPoints, direction));
        }
        store.setContextValue('dragMove', onDrag);
        store.setContextValue('snapPointChange', onSnapPointChange);
        store.setContextValue('dragEnd', (open: boolean) => onDragEnd?.({ open }));
    }
}
