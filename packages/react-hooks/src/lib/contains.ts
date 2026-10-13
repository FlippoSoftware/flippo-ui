export function contains(parent?: Element | null, child?: Element | null) {
    if (!parent || !child) {
        return false;
    }

    const rootNode = child.getRootNode?.();

    // First, attempt with faster native method
    if (parent.contains(child)) {
        return true;
    }

    // then fallback to custom implementation with Shadow DOM support
    if (rootNode && isShadowRoot(rootNode)) {
        let next = child;
        while (next) {
            if (parent === next) {
                return true;
            }

            // @ts-expect-error if undefined breake from while
            next = next.parentNode || (next instanceof ShadowRoot && next.host) || undefined;
        }
    }

    // Give up, the result is false
    return false;
}

function isShadowRoot(value: unknown): value is ShadowRoot {
    if (!hasWindow() || typeof ShadowRoot === 'undefined') {
        return false;
    }

    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}

function hasWindow() {
    return typeof window !== 'undefined';
}

function getWindow(value: any) {
    return value.ownerDocument?.defaultView || window;
}
