import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/**
 * Field: `root`, `label`, `control` (the input, styled as the Figma "Input Field"), `description`, `error`, `item`.
 * `appearance` and `size` style the control.
 */
export const field = sva({
    slots: ['root', 'label', 'control', 'description', 'error', 'item'],
    base: {
        root: 'fl-field-root',
        label: 'fl-field-label fl-text-label-default',
        control: 'fl-field-control fl-control',
        description: 'fl-field-description fl-text-label-weaker',
        error: 'fl-field-error fl-text-label-weaker',
        item: 'fl-field-item'
    },
    variants: {
        appearance: {
            light: { control: 'fl-control--light' },
            inverted: { control: 'fl-control--inverted' },
            underline: { control: 'fl-control--underline' },
            'underline-invisible': { control: 'fl-control--underline-invisible' }
        },
        size: {
            small: { control: 'fl-control--small' },
            medium: { control: 'fl-control--medium' },
            large: { control: 'fl-control--large' }
        }
    },
    compoundVariants: [
        {
            variants: { appearance: ['light', 'inverted'], size: ['small', 'medium'] },
            classNames: { control: 'fl-text-body-minus-weaker' }
        },
        {
            variants: { appearance: ['light', 'inverted'], size: 'large' },
            classNames: { control: 'fl-text-body-weaker' }
        },
        {
            variants: { appearance: ['underline', 'underline-invisible'] },
            classNames: { control: 'fl-text-title-1-stronger' }
        }
    ],
    defaultVariants: {
        appearance: 'light',
        size: 'medium'
    }
});

export type FieldVariants = VariantsOf<typeof field>;
