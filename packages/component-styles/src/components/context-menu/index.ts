import { sva } from '@lynstack/class-recipe';

import { menu } from '../menu';

/** Context menu: the menu slots plus `trigger`, the area that opens it. */
export const contextMenu = sva({
    composes: [menu],
    slots: ['trigger'],
    base: {
        trigger: 'fl-context-menu-trigger'
    },
    variants: {}
});
