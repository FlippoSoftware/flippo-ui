import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const container = cva({
    base: 'fl-container',
    variants: {
        size: {
            xs: 'fl-container--xs',
            sm: 'fl-container--sm',
            md: 'fl-container--md',
            lg: 'fl-container--lg',
            xl: 'fl-container--xl',
            '2xl': 'fl-container--2xl',
            full: 'fl-container--full'
        }
    },
    defaultVariants: {
        size: 'lg'
    }
});
export type ContainerVariants = VariantsOf<typeof container>;
