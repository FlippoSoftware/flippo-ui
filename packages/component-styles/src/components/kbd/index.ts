import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const kbd = cva({
    base: 'fl-kbd',
    variants: {
        size: {
            '1': 'fl-kbd--size-1',
            '2': 'fl-kbd--size-2',
            '3': 'fl-kbd--size-3',
            '4': 'fl-kbd--size-4',
            '5': 'fl-kbd--size-5',
            '6': 'fl-kbd--size-6',
            '7': 'fl-kbd--size-7',
            '8': 'fl-kbd--size-8',
            '9': 'fl-kbd--size-9'
        },
        variant: {
            outline: 'fl-kbd--outline',
            soft: 'fl-kbd--soft',
            ghost: 'fl-kbd--ghost'
        }
    },
    defaultVariants: {
        size: '2',
        variant: 'outline'
    }
});
export type KbdVariants = VariantsOf<typeof kbd>;
