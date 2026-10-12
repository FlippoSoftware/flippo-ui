import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const strong = cva({
    base: 'fl-strong',
    variants: {},
    defaultVariants: {}
});
export type StrongVariants = VariantsOf<typeof strong>;
