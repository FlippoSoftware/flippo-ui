import React from 'react';

import type { FloatingTreeStore } from '@flippo-software/core-components/floating';

const FloatingTreeContext = React.createContext<FloatingTreeStore | null>(null);
const FloatingNodeIdContext = React.createContext<string | null>(null);

/**
 * The floating tree of the closest popup root (nested popups share it).
 */
export function useFloatingTree() {
    return React.use(FloatingTreeContext);
}

/**
 * The node ID of the closest floating element (the parent of nested popups).
 */
export function useFloatingParentNodeId() {
    return React.use(FloatingNodeIdContext);
}

/**
 * Provides a core `FloatingTreeStore` to nested popups (replacement for `<FloatingTree>`).
 */
export function FloatingTree(props: { tree: FloatingTreeStore; children?: React.ReactNode }) {
    return <FloatingTreeContext value={props.tree}>{props.children}</FloatingTreeContext>;
}

/**
 * Makes `id` the parent node of nested popups (replacement for `<FloatingNode>`; the node itself is
 * registered by the core positioner).
 */
export function FloatingNode(props: { id: string; children?: React.ReactNode }) {
    return <FloatingNodeIdContext value={props.id}>{props.children}</FloatingNodeIdContext>;
}
