import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const center = cva({
    base: 'fl-center',
    variants: {},
    defaultVariants: {}
});
export type CenterVariants = VariantsOf<typeof center>;
