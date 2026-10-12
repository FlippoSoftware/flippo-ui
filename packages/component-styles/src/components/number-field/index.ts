import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

const STEP_BUTTON = 'fl-control-button fl-interactive fl-focus-ring';

/** Number field: `group` is the control box with `decrement`, `input` and `increment` inside. */
export const numberField = sva({
    slots: ['root', 'group', 'input', 'decrement', 'increment', 'scrubArea', 'scrubAreaCursor'],
    base: {
        root: 'fl-number-field-root',
        group: 'fl-number-field-group fl-control',
        input: 'fl-number-field-input',
        decrement: STEP_BUTTON,
        increment: STEP_BUTTON,
        scrubArea: 'fl-number-field-scrub-area',
        scrubAreaCursor: 'fl-number-field-scrub-area-cursor'
    },
    variants: {
        appearance: {
            light: { group: 'fl-control--light' },
            inverted: { group: 'fl-control--inverted' }
        },
        size: {
            small: { group: 'fl-control--small fl-text-body-minus-default' },
            medium: { group: 'fl-control--medium fl-text-body-default' },
            large: { group: 'fl-control--large fl-text-body-default' }
        }
    },
    defaultVariants: {
        appearance: 'light',
        size: 'medium'
    }
});

export type NumberFieldVariants = VariantsOf<typeof numberField>;
