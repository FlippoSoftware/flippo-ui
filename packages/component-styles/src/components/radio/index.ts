import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Radio: `root` is the round box, `indicator` the dot, `label` lays it out with its text. */
export const radio = sva({
    slots: ['root', 'indicator', 'label'],
    base: {
        root: 'fl-radio-root fl-check fl-interactive fl-focus-ring',
        indicator: 'fl-radio-indicator',
        label: 'fl-choice-label fl-text-body-minus-default'
    },
    variants: {
        size: {
            small: { root: 'fl-radio-root--small' },
            medium: {},
            large: { root: 'fl-radio-root--large' }
        }
    },
    defaultVariants: {
        size: 'medium'
    }
});

export type RadioVariants = VariantsOf<typeof radio>;
