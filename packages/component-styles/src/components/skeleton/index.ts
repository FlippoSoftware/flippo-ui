import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const skeleton = cva({
    base: 'fl-skeleton',
    variants: {
        animation: {
            pulse: 'fl-skeleton--pulse',
            shimmer: 'fl-skeleton--shimmer',
            none: 'fl-skeleton--none'
        },
        circle: {
            true: 'fl-skeleton--circle',
            false: ''
        }
    },
    defaultVariants: {
        animation: 'pulse',
        circle: false
    }
});
export type SkeletonVariants = VariantsOf<typeof skeleton>;
