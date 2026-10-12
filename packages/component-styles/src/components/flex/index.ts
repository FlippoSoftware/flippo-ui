import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const flex = cva({
    base: 'fl-flex',
    variants: {},
    defaultVariants: {}
});
export type FlexVariants = VariantsOf<typeof flex>;
