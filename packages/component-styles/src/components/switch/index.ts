import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Switch: `root` is the track, `thumb` slides when `data-checked`; `label` lays it out with its text. */
export const switchRecipe = sva({
    slots: ['root', 'thumb', 'label'],
    base: {
        root: 'fl-switch-root fl-focus-ring',
        thumb: 'fl-switch-thumb',
        label: 'fl-choice-label fl-text-body-minus-default'
    },
    variants: {
        size: {
            small: { root: 'fl-switch-root--small' },
            medium: {},
            large: { root: 'fl-switch-root--large' }
        }
    },
    defaultVariants: {
        size: 'medium'
    }
});

export type SwitchVariants = VariantsOf<typeof switchRecipe>;
