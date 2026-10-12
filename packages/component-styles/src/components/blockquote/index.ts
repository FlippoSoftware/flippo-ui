import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const blockquote = cva({
    base: 'fl-blockquote',
    variants: {
        size: {
            '1': 'fl-blockquote--size-1',
            '2': 'fl-blockquote--size-2',
            '3': 'fl-blockquote--size-3'
        },
        color: {
            primary: 'fl-blockquote--primary',
            brand: 'fl-blockquote--brand',
            success: 'fl-blockquote--success',
            warning: 'fl-blockquote--warning',
            error: 'fl-blockquote--error'
        }
    },
    defaultVariants: {
        size: '2',
        color: 'brand'
    }
});
export type BlockquoteVariants = VariantsOf<typeof blockquote>;
