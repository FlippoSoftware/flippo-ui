import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const quote = cva({
    base: 'fl-quote',
    variants: {},
    defaultVariants: {}
});
export type QuoteVariants = VariantsOf<typeof quote>;
