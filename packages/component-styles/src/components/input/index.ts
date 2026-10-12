import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/**
 * Input (Figma "Input Field", "Searchbar"): `root` is the box, `control` the native input inside it, `icon` a
 * leading icon, `clear` the clear button.
 */
export const input = sva({
    slots: ['root', 'control', 'icon', 'clear'],
    base: {
        root: 'fl-input-root fl-control',
        control: 'fl-input-control',
        icon: 'fl-input-icon fl-icon',
        clear: 'fl-input-clear fl-control-button fl-interactive fl-focus-ring'
    },
    variants: {
        appearance: {
            light: { root: 'fl-control--light' },
            inverted: { root: 'fl-control--inverted' },
            underline: { root: 'fl-control--underline' },
            'underline-invisible': { root: 'fl-control--underline-invisible' }
        },
        size: {
            small: { root: 'fl-control--small' },
            medium: { root: 'fl-control--medium' },
            large: { root: 'fl-control--large' }
        }
    },
    compoundVariants: [
        {
            variants: { appearance: ['light', 'inverted'], size: ['small', 'medium'] },
            classNames: { root: 'fl-text-body-minus-weaker' }
        },
        {
            variants: { appearance: ['light', 'inverted'], size: 'large' },
            classNames: { root: 'fl-text-body-weaker' }
        },
        {
            variants: { appearance: ['underline', 'underline-invisible'] },
            classNames: { root: 'fl-text-title-1-stronger' }
        }
    ],
    defaultVariants: {
        appearance: 'light',
        size: 'medium'
    }
});

export type InputVariants = VariantsOf<typeof input>;
