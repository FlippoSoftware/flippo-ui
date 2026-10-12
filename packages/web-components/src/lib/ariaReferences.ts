/**
 * ARIA references (`aria-labelledby`, `aria-describedby`) do not cross shadow boundaries: an element in a shadow root
 * cannot point at the page's label. Replaces them on `element` with the text they refer to (`aria-label`,
 * `aria-description`), looked up from `host`'s tree. An `aria-label` given explicitly is kept.
 */
export function mirrorAriaReferences(element: HTMLElement, host: HTMLElement) {
    mirror(element, host, 'aria-labelledby', 'aria-label');
    mirror(element, host, 'aria-describedby', 'aria-description');
}

const WHITESPACE = /\s+/;

/**
 * The attributes set by the mirroring, by element: they are updated (or removed) on the next call.
 */
const mirrored = new WeakMap<HTMLElement, Set<string>>();

function mirror(element: HTMLElement, host: HTMLElement, reference: string, text: string) {
    let own = mirrored.get(element);
    if (!own) {
        own = new Set();
        mirrored.set(element, own);
    }
    const ids = element.getAttribute(reference);
    if (!ids) {
        if (own.delete(text)) {
            element.removeAttribute(text);
        }
        return;
    }
    const root = host.getRootNode() as Document | ShadowRoot;
    const content = ids
        .split(WHITESPACE)
        .map((id) => root.getElementById?.(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
    element.removeAttribute(reference);
    if (element.hasAttribute(text) && !own.has(text)) {
        return;
    }
    if (content) {
        element.setAttribute(text, content);
        own.add(text);
    } else if (own.delete(text)) {
        element.removeAttribute(text);
    }
}
