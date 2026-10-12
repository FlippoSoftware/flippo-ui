import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const section = cva({
    base: 'fl-section',
    variants: {
        size: {
            sm: 'fl-section--sm',
            md: 'fl-section--md',
            lg: 'fl-section--lg',
            xl: 'fl-section--xl'
        }
    },
    defaultVariants: {
        size: 'md'
    }
});
export type SectionVariants = VariantsOf<typeof section>;
