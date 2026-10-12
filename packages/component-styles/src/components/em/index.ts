import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const em = cva({
    base: 'fl-em',
    variants: {},
    defaultVariants: {}
});
export type EmVariants = VariantsOf<typeof em>;
