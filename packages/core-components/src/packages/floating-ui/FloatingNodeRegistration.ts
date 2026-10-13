import type { Placement } from '@floating-ui/dom';

import { Connectable } from '~@lib/Connectable';

import { attachFloatingNodeContext, createFloatingNodeContext } from './FloatingNodeContext';

import type { FloatingRootStore } from './FloatingRootStore';
import type { FloatingTreeStore } from './FloatingTreeStore';
import type { FloatingNodeType } from './types';

/**
 * Registers a floating element as a node of a floating tree (nested popups) and attaches
 * the floating root's node context to it. The node is in the tree while connected. Replacement for `<FloatingNode>` + `useFloating({ nodeId })`.
 */
export class FloatingNodeRegistration extends Connectable {
    readonly node: FloatingNodeType;

    private readonly tree: FloatingTreeStore | null;

    constructor(tree: FloatingTreeStore | null | undefined, id: string, parentId: string | null = null) {
        super();
        this.tree = tree ?? null;
        this.node = { id, parentId };
    }

    protected override onConnect() {
        this.tree?.addNode(this.node);
    }

    /**
     * Attaches the node context of `store` (call again when the floating root changes).
     */
    attach(store: FloatingRootStore, getPlacement?: () => Placement) {
        const context = createFloatingNodeContext(store, this.node.id, getPlacement);
        this.node.context = context;
        attachFloatingNodeContext(store, context, this.tree);
    }

    protected override onDisconnect() {
        this.tree?.removeNode(this.node);
    }
}
