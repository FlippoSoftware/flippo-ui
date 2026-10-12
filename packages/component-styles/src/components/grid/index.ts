import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const grid = sva({
    slots: ['root', 'item'],
    base: {
        root: 'fl-grid',
        item: 'fl-grid-item'
    },
    variants: {},
    defaultVariants: {}
});
export type GridVariants = VariantsOf<typeof grid>;
