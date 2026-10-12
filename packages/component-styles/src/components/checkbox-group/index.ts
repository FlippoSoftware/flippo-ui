import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Checkbox group: a column of checkboxes, or a row with `orientation: 'horizontal'`. */
export const checkboxGroup = cva({
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

export type CheckboxGroupVariants = VariantsOf<typeof checkboxGroup>;
