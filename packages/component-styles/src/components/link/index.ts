import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Link (Figma "Link"): neutral or branded. */
export const link = cva({
    base: 'fl-link fl-interactive fl-focus-ring',
    variants: {
        variant: {
            neutral: 'fl-link--neutral',
            branded: 'fl-link--branded'
        },
        size: {
            inherit: '',
            small: 'fl-text-body-minus-default',
            medium: 'fl-text-body-default'
        },
        underline: {
            true: 'fl-link--underline',
            false: ''
        }
    },
    defaultVariants: {
        variant: 'neutral',
        size: 'small',
        underline: false
    }
});

export type LinkVariants = VariantsOf<typeof link>;
