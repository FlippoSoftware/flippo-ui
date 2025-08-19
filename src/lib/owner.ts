export function ownerDocument(node: Element | null) {
    return node?.ownerDocument || document;
}

export function ownerWindow(node: any): typeof window {
    return node?.ownerDocument?.defaultView || window;
}
