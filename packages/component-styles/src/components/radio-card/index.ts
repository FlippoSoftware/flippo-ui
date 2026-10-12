import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Radio card: a card that is a radio; `indicator` is its round box. */
export const radioCard = sva({
    slots: ['root', 'indicator'],
    base: {
        root: 'fl-choice-card fl-interactive fl-focus-ring fl-text-body-minus-default',
        indicator: 'fl-radio-card-indicator fl-check'
    },
    variants: {
        indicatorPosition: {
            start: {},
            end: { indicator: 'fl-radio-card-indicator--end' }
        }
    },
    defaultVariants: {
        indicatorPosition: 'start'
    }
});

export type RadioCardVariants = VariantsOf<typeof radioCard>;
