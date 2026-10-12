/**
 * Shows floating elements in the top layer with the Popover API (`popover="manual"` + `showPopover()`), instead of
 * moving them into a portal: frameworks own the nodes, so the elements never move them. In the top layer an element
 * is above everything, whatever the `overflow` and `z-index` of its ancestors.
 */

const TOP_LAYER_ATTRIBUTE = 'data-flippo-top-layer';

/** The cascade layer of the reset styles (see `RESET_STYLES`). */
export const TOP_LAYER_LAYER = 'flippo-top-layer';

/**
 * Undoes the browser styles of `[popover]`: the border, padding and background, and, unless the element is centered
 * (dialogs), the centering (`inset: 0` and `margin: auto`), which would fight the positioning of popups.
 *
 * The rules live in the `flippo-top-layer` cascade layer: unlayered styles beat every layer whatever their specificity,
 * so an unlayered reset would also beat a page's layered styles (a design system's `@layer`), e.g. erase the `inset`
 * of a backdrop or the background of a popup. Declare `@layer flippo-top-layer` before your own layers to keep it
 * the weakest; the browser styles of `[popover]` lose to it anyway, being user-agent styles.
 */
const RESET_STYLES = `@layer ${TOP_LAYER_LAYER} {
:where([${TOP_LAYER_ATTRIBUTE}]) {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    overflow: visible;
}
:where([${TOP_LAYER_ATTRIBUTE}=""]) {
    inset: auto;
    margin: 0;
}
}`;

export type TopLayerOptions = {
    /**
     * Keeps the browser's centering of popovers in the viewport (for dialogs). Positioned popups are not centered.
     * @default false
     */
    centered?: boolean | undefined;
};

const styledRoots = new WeakSet<Node>();

type PopoverElement = HTMLElement & { showPopover(): void; hidePopover(): void };

function supportsPopover(element: HTMLElement): element is PopoverElement {
    return typeof (element as Partial<PopoverElement>).showPopover === 'function';
}

/**
 * Makes `element` a manual popover and adds the reset styles to its document (or shadow root). Without the Popover
 * API, nothing changes: the element is positioned in place.
 */
export function prepareTopLayer(element: HTMLElement, options: TopLayerOptions = {}) {
    if (!supportsPopover(element)) {
        return;
    }
    element.setAttribute('popover', 'manual');
    element.setAttribute(TOP_LAYER_ATTRIBUTE, options.centered ? 'centered' : '');

    const root = element.getRootNode();
    if (styledRoots.has(root)) {
        return;
    }
    const style = element.ownerDocument.createElement('style');
    style.textContent = RESET_STYLES;
    // `nodeType` rather than `instanceof`, which fails for nodes of another window (an iframe).
    if (root.nodeType === Node.DOCUMENT_NODE) {
        (root as Document).head.append(style);
    } else if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in root) {
        (root as ShadowRoot).prepend(style);
    } else {
        // Not in a document yet: added on the next connection.
        return;
    }
    styledRoots.add(root);
}

/**
 * Undoes {@link prepareTopLayer}.
 */
export function releaseTopLayer(element: HTMLElement) {
    showInTopLayer(element, false);
    element.removeAttribute('popover');
    element.removeAttribute(TOP_LAYER_ATTRIBUTE);
}

/**
 * The elements {@link showInTopLayer} has shown. Manual popovers are never closed by the browser, so this is their
 * state, unless the page calls `hidePopover()` on them itself.
 */
const shownElements = new WeakSet<HTMLElement>();

/**
 * Shows `element` in the top layer, or removes it from there. Returns whether it was shown before.
 */
export function showInTopLayer(element: HTMLElement, shown: boolean): boolean {
    const wasShown = shownElements.has(element);
    if (!supportsPopover(element) || !element.hasAttribute('popover') || !element.isConnected || wasShown === shown) {
        return wasShown;
    }
    try {
        if (shown) {
            element.showPopover();
        } else {
            element.hidePopover();
        }
    } catch {
        // Already in that state (`InvalidStateError`).
    }
    if (shown) {
        shownElements.add(element);
    } else {
        shownElements.delete(element);
    }
    return wasShown;
}

/**
 * Shows and hides elements in the top layer so that the shown ones stack in the given order (the last one on top),
 * e.g. `[backdrop, popup]`. The top layer stacks in the order elements are shown: when an element has to be shown below
 * one that is already shown, the ones above are shown again.
 */
export function showInTopLayerInOrder(stack: ReadonlyArray<readonly [HTMLElement | null | undefined, boolean]>) {
    let restackFrom = -1;
    stack.forEach(([element, shown], index) => {
        if (element && shown && !shownElements.has(element) && restackFrom === -1) {
            restackFrom = index;
        }
    });
    stack.forEach(([element, shown], index) => {
        if (!element) {
            return;
        }
        if (!shown) {
            showInTopLayer(element, false);
        } else if (restackFrom !== -1 && index > restackFrom) {
            // Above an element shown now: show it again, on top of it.
            showInTopLayer(element, false);
            showInTopLayer(element, true);
        } else {
            showInTopLayer(element, true);
        }
    });
}
