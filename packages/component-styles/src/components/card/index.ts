import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const card = sva({
    slots: ['root', 'content', 'footer', 'title', 'description'],
    base: {
        root: 'fl-card-root',
        content: 'fl-card-content',
        footer: 'fl-card-footer',
        title: 'fl-card-title fl-text-heading-3-default',
        description: 'fl-card-description fl-text-body-default'
    },
    variants: {},
    defaultVariants: {}
});
export type CardVariants = VariantsOf<typeof card>;
