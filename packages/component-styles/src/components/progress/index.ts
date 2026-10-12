import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Progress: `root`, `label`, `value`, `track` and `indicator`. The meter uses the same classes. */
export const progress = sva({
    slots: ['root', 'label', 'value', 'track', 'indicator'],
    base: {
        root: 'fl-progress-root',
        label: 'fl-progress-label fl-text-label-default',
        value: 'fl-progress-value fl-text-label-weaker',
        track: 'fl-progress-track',
        indicator: 'fl-progress-indicator'
    },
    variants: {
        size: {
            medium: {},
            large: { track: 'fl-progress-track--large' }
        }
    },
    defaultVariants: {
        size: 'medium'
    }
});

export type ProgressVariants = VariantsOf<typeof progress>;
