import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/**
 * Button and icon button (Figma "Button", "Icon Button").
 *
 * @example
 * button({ variant: 'secondary', size: 'small' });
 * // => 'fl-button fl-interactive fl-focus-ring fl-button--secondary fl-button--small fl-text-body-minus-stronger'
 */
export const button = cva({
    base: 'fl-button fl-interactive fl-focus-ring',
    variants: {
        variant: {
            primary: 'fl-button--primary',
            secondary: 'fl-button--secondary',
            outlined: 'fl-button--outlined',
            label: 'fl-button--label',
            danger: 'fl-button--danger'
        },
        size: {
            large: 'fl-button--large fl-text-body-stronger',
            medium: 'fl-button--medium fl-text-body-stronger',
            small: 'fl-button--small fl-text-body-minus-stronger',
            'x-small': 'fl-button--x-small fl-text-label-default'
        },
        /** Only an icon: a circle as wide as it is high. */
        iconOnly: {
            true: 'fl-button--icon',
            false: ''
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'medium',
        iconOnly: false
    }
});

export type ButtonVariants = VariantsOf<typeof button>;
