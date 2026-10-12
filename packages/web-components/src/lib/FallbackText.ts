/**
 * Text shown by an element while it has no content of its own: the fallback content of a `<slot>` in its shadow root
 * (e.g. the formatted value of a progress bar). The page's children, if any, replace it, and are never touched.
 */
export class FallbackText {
    private readonly slot: HTMLSlotElement;

    constructor(host: HTMLElement) {
        const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
        this.slot = host.ownerDocument.createElement('slot');
        root.append(this.slot);
        // Whitespace between tags (`<x-value>\n</x-value>`) is not content of its own, but a default slot would take
        // it and hide the fallback: while the children are only whitespace, the slot takes a name no child has.
        const sync = () => {
            this.slot.name = hasContent(host) ? '' : FALLBACK_SLOT;
        };
        sync();
        new MutationObserver(sync).observe(host, { childList: true, characterData: true, subtree: true });
    }

    set(text: string | null | undefined) {
        const next = text ?? '';
        if (this.slot.childElementCount > 0 || this.slot.textContent !== next) {
            this.slot.textContent = next;
        }
    }

    /**
     * Shows several texts as a list (`<ul part="list">`, items `part="item"`).
     */
    setList(items: readonly string[]) {
        const document = this.slot.ownerDocument;
        const list = document.createElement('ul');
        list.setAttribute('part', 'list');
        for (const item of items) {
            const element = document.createElement('li');
            element.setAttribute('part', 'item');
            element.textContent = item;
            list.append(element);
        }
        this.slot.replaceChildren(list);
    }
}

/** A slot name no child uses: nothing is assigned to the slot, so it shows its fallback text. */
const FALLBACK_SLOT = 'flippo-fallback';

function hasContent(host: HTMLElement): boolean {
    for (const node of host.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) {
            return true;
        }
    }
    return false;
}
