import { ListRegistryItem } from '@flippo-software/core-components/composite';
import { Store } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { SnippetPart } from '../root/SnippetRootContext';

/**
 * A line of the snippet: its text (or `value`) is copied.
 *
 * Attributes: `value` (the copied text, instead of the line's text).
 * State attributes: `data-index`.
 */
export class SnippetLineElement extends SnippetPart.withAttributes({
    value: 'string'
}) {
    private item!: ListRegistryItem<{ text: string | null | undefined }>;

    private readonly index = new Store({ index: -1 });

    private observer: MutationObserver | null = null;

    protected override createParts() {
        this.item = new ListRegistryItem(this.snippet.registry, {
            metadata: { text: this.getText() },
            onIndexChange: (index) => this.index.set('index', index)
        });
    }

    protected override applyOptions() {
        this.item.setMetadata({ text: this.getText() });
    }

    protected override connectParts() {
        const disconnect = this.item.connect();
        // The copied text follows the line's text.
        this.observer = new MutationObserver(() => this.item.setMetadata({ text: this.getText() }));
        this.observer.observe(this, { childList: true, subtree: true, characterData: true });
        return () => {
            this.observer?.disconnect();
            this.observer = null;
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.item?.setElement(element);
    }

    protected override getProps(): Props {
        return { 'data-index': String(this.index.state.index) };
    }

    private getText(): string {
        return this.value ?? this.textContent ?? '';
    }
}
