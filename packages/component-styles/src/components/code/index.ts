import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const code = cva({
    base: 'fl-code',
    variants: {
        size: {
            '1': 'fl-code--size-1',
            '2': 'fl-code--size-2',
            '3': 'fl-code--size-3',
            '4': 'fl-code--size-4',
            '5': 'fl-code--size-5',
            '6': 'fl-code--size-6',
            '7': 'fl-code--size-7',
            '8': 'fl-code--size-8',
            '9': 'fl-code--size-9'
        },
        variant: {
            soft: 'fl-code--soft',
            solid: 'fl-code--solid',
            outline: 'fl-code--outline',
            ghost: 'fl-code--ghost'
        }
    },
    defaultVariants: {
        size: '2',
        variant: 'soft'
    }
});
export type CodeVariants = VariantsOf<typeof code>;
