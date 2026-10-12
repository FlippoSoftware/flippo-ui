import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Marquee: `root` and the scrolling `track`s; `fade` softens the edges. */
export const marquee = sva({
    slots: ['root', 'track'],
    base: {
        root: 'fl-marquee-root',
        track: 'fl-marquee-track'
    },
    variants: {
        fade: {
            true: { root: 'fl-marquee-root--fade' },
            false: {}
        }
    },
    defaultVariants: {
        fade: false
    }
});

export type MarqueeVariants = VariantsOf<typeof marquee>;
