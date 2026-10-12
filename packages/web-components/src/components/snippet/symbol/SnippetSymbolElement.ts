import type { Props } from '@flippo-software/core-components/props';

import { FallbackText } from '../../../lib/FallbackText';
import { SnippetPart } from '../root/SnippetRootContext';

/**
 * The prompt symbol of the snippet (`$`), as text when the element has no content of its own.
 */
export class SnippetSymbolElement extends SnippetPart.withAttributes({}) {
    private readonly text = new FallbackText(this);

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        const { symbol } = this.snippet.getState();
        this.text.set(symbol);
        return { 'aria-hidden': true, 'data-snippet-symbol': '' };
    }
}
