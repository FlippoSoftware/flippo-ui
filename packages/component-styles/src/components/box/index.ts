import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const box = cva({
    base: 'fl-box',
    variants: {},
    defaultVariants: {}
});
export type BoxVariants = VariantsOf<typeof box>;
