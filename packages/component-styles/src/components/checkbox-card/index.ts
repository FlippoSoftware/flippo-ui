import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Checkbox card: a card that is a checkbox; `indicator` is its box. */
export const checkboxCard = sva({
    slots: ['root', 'indicator'],
    base: {
        root: 'fl-choice-card fl-interactive fl-focus-ring fl-text-body-minus-default',
        indicator: 'fl-checkbox-card-indicator fl-check'
    },
    variants: {
        indicatorPosition: {
            start: {},
            end: { indicator: 'fl-checkbox-card-indicator--end' }
        }
    },
    defaultVariants: {
        indicatorPosition: 'start'
    }
});

export type CheckboxCardVariants = VariantsOf<typeof checkboxCard>;
