import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const spinner = cva({
    base: 'fl-spinner',
    variants: {
        size: {
            'x-small': 'fl-spinner--x-small',
            small: 'fl-spinner--small',
            medium: 'fl-spinner--medium',
            large: 'fl-spinner--large'
        },
        color: {
            brand: 'fl-spinner--brand',
            danger: 'fl-spinner--danger',
            warning: 'fl-spinner--warning',
            info: 'fl-spinner--info',
            success: 'fl-spinner--success',
            error: 'fl-spinner--error',
            current: 'fl-spinner--current'
        }
    },
    defaultVariants: {
        size: 'medium',
        color: 'brand'
    }
});
export type SpinnerVariants = VariantsOf<typeof spinner>;
