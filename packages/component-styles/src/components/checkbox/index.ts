import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Checkbox: `root` is the box, `indicator` holds the check mark, `label` lays it out with its text. */
export const checkbox = sva({
    slots: ['root', 'indicator', 'label'],
    base: {
        root: 'fl-checkbox-root fl-check fl-choice-control fl-interactive fl-focus-ring',
        indicator: 'fl-checkbox-indicator',
        label: 'fl-choice-label fl-text-body-minus-default'
    },
    variants: {
        size: {
            small: { root: 'fl-checkbox-root--small', label: 'fl-choice-label--small' },
            medium: {},
            large: { root: 'fl-checkbox-root--large', label: 'fl-choice-label--large' }
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

export type CheckboxVariants = VariantsOf<typeof checkbox>;
