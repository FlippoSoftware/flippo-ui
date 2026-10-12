import { sva } from '@lynstack/class-recipe';

import { button } from '../button';

/** Snippet: `root`, `line`, `symbol` and the `copyButton` (a small label icon button, import `button.css` too). */
export const snippet = sva({
    slots: ['root', 'line', 'symbol', 'copyButton'],
    base: {
        root: 'fl-snippet-root fl-mono fl-text-body-minus-default',
        line: 'fl-snippet-line',
        symbol: 'fl-snippet-symbol',
        copyButton: `fl-snippet-copy-button ${button({ variant: 'label', size: 'small', iconOnly: true })}`
    },
    variants: {}
});
