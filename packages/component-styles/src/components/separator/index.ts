import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/**
 * Separator (Figma "Divider"). `spacing` is the space across the line, `inset` the space along it
 * (Figma "Padding=12px 6px" is `inset: 'medium', spacing: 'small'`).
 */
export const separator = cva({
    base: 'fl-separator',
    variants: {
        spacing: {
            none: '',
            small: 'fl-separator--spacing-small',
            medium: 'fl-separator--spacing-medium'
        },
        inset: {
            none: '',
            small: 'fl-separator--inset-small',
            medium: 'fl-separator--inset-medium'
        }
    },
    defaultVariants: {
        spacing: 'none',
        inset: 'none'
    }
});

export type SeparatorVariants = VariantsOf<typeof separator>;
