import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/**
 * Skeleton text: a placeholder for a paragraph, made of `line`s as tall as the lines of the current font (`1lh`),
 * so it takes the place of the text it stands for. The last line is shorter.
 */
export const skeletonText = sva({
    slots: ['root', 'line'],
    base: {
        root: 'fl-skeleton-text',
        line: 'fl-skeleton fl-skeleton-text-line'
    },
    variants: {
        animation: {
            pulse: { root: 'fl-skeleton--pulse' },
            shimmer: { root: 'fl-skeleton--shimmer' },
            none: { root: 'fl-skeleton--none' }
        }
    },
    defaultVariants: {
        animation: 'pulse'
    }
});

export type SkeletonTextVariants = VariantsOf<typeof skeletonText>;
