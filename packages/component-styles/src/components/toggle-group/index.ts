import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Toggle group: the container of toggles (style the toggles with `toggle()`). */
export const toggleGroup = cva({
    base: 'fl-toggle-group',
    variants: {
        contained: {
            true: 'fl-toggle-group--contained',
            false: ''
        }
    },
    defaultVariants: {
        contained: false
    }
});

export type ToggleGroupVariants = VariantsOf<typeof toggleGroup>;
