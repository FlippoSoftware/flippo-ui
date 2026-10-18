import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Switch: `root` is the track, `thumb` slides when `data-checked`; `label` lays it out with its text. */
export const switchRecipe = sva({
    slots: ['root', 'thumb', 'label'],
    base: {
        root: 'fl-switch-root fl-choice-control fl-focus-ring',
        thumb: 'fl-switch-thumb',
        label: 'fl-choice-label fl-text-body-minus-default'
    },
    variants: {
        size: {
            small: { root: 'fl-switch-root--small', label: 'fl-choice-label--small' },
            medium: {},
            large: { root: 'fl-switch-root--large', label: 'fl-choice-label--large' }
        },
        /** The label is as high as its text, not as a control row (a dense table, a list of options). */
        compact: {
            true: { label: 'fl-choice-label--compact' },
            false: {}
        }
    },
    defaultVariants: {
        size: 'medium',
        compact: false
    }
});

export type SwitchVariants = VariantsOf<typeof switchRecipe>;
