import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Radio: `root` is the round box, `indicator` the dot, `label` lays it out with its text. */
export const radio = sva({
    slots: ['root', 'indicator', 'label'],
    base: {
        root: 'fl-radio-root fl-check fl-choice-control fl-interactive fl-focus-ring',
        indicator: 'fl-radio-indicator',
        label: 'fl-choice-label fl-text-body-minus-default'
    },
    variants: {
        size: {
            small: { root: 'fl-radio-root--small', label: 'fl-choice-label--small' },
            medium: {},
            large: { root: 'fl-radio-root--large', label: 'fl-choice-label--large' }
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

export type RadioVariants = VariantsOf<typeof radio>;
