import { Store, untracked } from '@flippo-software/store';

import { MenuRootMachine } from '~@components/menu/root/MenuRootMachine';
import { Connectable } from '~@lib/Connectable';

import type { MenuRootOptions, MenuRootSetup } from '~@components/menu/root/MenuRootMachine';
import type { ContextMenuParentContext } from '~@components/menu/store/MenuStore';
import type { MutableRef } from '~@lib/types';

import { createAnchor } from '../utils/createAnchor';

import type { ContextMenuAnchor } from '../utils/ContextMenuAnchor';

/**
 * State machine of `ContextMenu.Root`: a menu anchored at the cursor, opened by the trigger.
 */
export class ContextMenuRootMachine<Payload = unknown> extends Connectable {
    readonly context: ContextMenuParentContext & {
        /**
         * Where the menu is anchored (the cursor). Reads a store, so effects positioning the menu follow it.
         */
        readonly anchor: ContextMenuAnchor;
        backdropRef: MutableRef<HTMLDivElement | null>;
        internalBackdropRef: MutableRef<HTMLDivElement | null>;
        positionerRef: MutableRef<HTMLElement | null>;
        initialCursorPointRef: MutableRef<{ x: number; y: number } | null>;
        actionsRef: MutableRef<{ setOpen: (open: boolean, eventDetails: never) => void } | null>;
    };

    readonly menu: MenuRootMachine<Payload>;

    private readonly anchorStore = new Store<{ anchor: ContextMenuAnchor }>({ anchor: createAnchor(0, 0, 0) });

    constructor(options: MenuRootOptions, setup: Omit<MenuRootSetup<Payload>, 'parent'>) {
        super();
        const { anchorStore } = this;
        this.context = {
            get anchor() {
                return anchorStore.state.anchor;
            },
            backdropRef: { current: null },
            internalBackdropRef: { current: null },
            actionsRef: { current: null },
            positionerRef: { current: null },
            allowMouseUpTriggerRef: { current: true },
            initialCursorPointRef: { current: null },
            rootId: setup.rootId
        };
        this.menu = new MenuRootMachine<Payload>(options, { ...setup, parent: { type: 'context-menu', context: this.context } });
    }

    get store() {
        return this.menu.store;
    }

    setOptions(options: MenuRootOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.menu.setOptions(options);
        });
    }

    /**
     * Applies the options' side effects after a commit.
     */
    afterCommit() {
        this.menu.afterCommit();
    }

    /**
     * Moves the anchor; the positioner follows it.
     */
    setAnchor(anchor: ContextMenuAnchor) {
        this.anchorStore.set('anchor', anchor);
    }

    protected override onConnect() {
        this.connectChild(this.menu);
    }
}
