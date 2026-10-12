import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Toggle (Figma "Toggle"): an icon toggle or a labeled pill; `data-pressed` is "on". */
export const toggle = cva({
    base: 'fl-toggle fl-interactive fl-focus-ring',
    variants: {
        variant: {
            icon: '',
            labeled: 'fl-toggle--labeled fl-text-body-minus-stronger'
        },
        size: {
            small: 'fl-toggle--small',
            medium: 'fl-toggle--medium',
            large: 'fl-toggle--large'
        }
    },
    defaultVariants: {
        variant: 'icon',
        size: 'medium'
    }
});

export type ToggleVariants = VariantsOf<typeof toggle>;
