import { sva } from '@lynstack/class-recipe';

import { button } from '../button';
import { input } from '../input';
import { link } from '../link';

/**
 * Toolbar: `root`, `group`, `separator`; `button` is a small label button, `link` a link and `input` a small
 * inverted control (import `button.css`, `link.css` and `input.css` too).
 */
export const toolbar = sva({
    slots: ['root', 'group', 'separator', 'button', 'link', 'input'],
    base: {
        root: 'fl-toolbar-root',
        group: 'fl-toolbar-group',
        separator: 'fl-toolbar-separator',
        button: button({ variant: 'label', size: 'small' }),
        link: link(),
        input: `${input({ appearance: 'inverted', size: 'small' }).root} fl-input-control`
    },
    variants: {}
});
