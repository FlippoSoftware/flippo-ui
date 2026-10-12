import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Radio group: a column of radios, or a row with `orientation: 'horizontal'`. */
export const radioGroup = cva({
    base: 'fl-choice-group',
    variants: {
        orientation: {
            vertical: '',
            horizontal: 'fl-choice-group--horizontal'
        }
    },
    defaultVariants: {
        orientation: 'vertical'
    }
});

export type RadioGroupVariants = VariantsOf<typeof radioGroup>;
