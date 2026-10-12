import { sva } from '@lynstack/class-recipe';

/** Scroll area: `root`, `viewport`, `content`, `scrollbar`, `thumb` and `corner`. */
export const scrollArea = sva({
    slots: ['root', 'viewport', 'content', 'scrollbar', 'thumb', 'corner'],
    base: {
        root: 'fl-scroll-area-root',
        viewport: 'fl-scroll-area-viewport',
        content: '',
        scrollbar: 'fl-scroll-area-scrollbar',
        thumb: 'fl-scroll-area-thumb',
        corner: 'fl-scroll-area-corner'
    },
    variants: {}
});
