import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const list = sva({
    slots: ['root', 'item', 'marker', 'subheader'],
    base: {
        root: 'fl-list',
        item: 'fl-list-item',
        marker: 'fl-list-marker',
        subheader: 'fl-list-subheader fl-text-label-default'
    },
    variants: {},
    defaultVariants: {}
});
export type ListVariants = VariantsOf<typeof list>;
