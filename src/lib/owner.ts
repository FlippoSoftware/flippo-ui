/**
 * The document of a node (the global document when there is none).
 */
export function ownerDocument(node?: Node | null): Document {
    return node?.ownerDocument ?? document;
}

/**
 * The window of a node (the global window when there is none).
 */
export function ownerWindow(node?: Node | null): Window & typeof globalThis {
    return (ownerDocument(node).defaultView ?? window) as Window & typeof globalThis;
}
