import { cva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

export const text = cva({
    base: 'fl-text',
    variants: {
        size: {
            'display-1': '',
            'display-2': '',
            'title-1': '',
            'title-2': '',
            'title-3': '',
            'heading-1': '',
            'heading-2': '',
            'heading-3': '',
            'body-plus': '',
            body: '',
            'body-minus': '',
            label: ''
        },
        weight: {
            weaker: '',
            default: '',
            stronger: ''
        },
        color: {
            primary: 'fl-text--primary',
            secondary: 'fl-text--secondary',
            tertiary: 'fl-text--tertiary',
            quaternary: 'fl-text--quaternary',
            white: 'fl-text--white',
            disabled: 'fl-text--disabled',
            brand: 'fl-text--brand',
            success: 'fl-text--success',
            error: 'fl-text--error',
            warning: 'fl-text--warning'
        },
        align: {
            left: 'fl-text--left',
            center: 'fl-text--center',
            right: 'fl-text--right',
            justify: 'fl-text--justify'
        },
        transform: {
            none: 'fl-text--none',
            uppercase: 'fl-text--uppercase',
            lowercase: 'fl-text--lowercase',
            capitalize: 'fl-text--capitalize'
        },
        truncate: {
            true: 'fl-text--truncate',
            false: ''
        }
    },
    defaultVariants: {
        size: 'body',
        weight: 'default',
        color: 'primary',
        transform: 'none',
        truncate: false
    },
    compoundVariants: [
        {
            variants: {
                size: 'display-1',
                weight: 'weaker'
            },
            className: 'fl-text-display-1-weaker'
        },
        {
            variants: {
                size: 'display-1',
                weight: 'default'
            },
            className: 'fl-text-display-1-default'
        },
        {
            variants: {
                size: 'display-1',
                weight: 'stronger'
            },
            className: 'fl-text-display-1-stronger'
        },
        {
            variants: {
                size: 'display-2',
                weight: 'weaker'
            },
            className: 'fl-text-display-2-weaker'
        },
        {
            variants: {
                size: 'display-2',
                weight: 'default'
            },
            className: 'fl-text-display-2-default'
        },
        {
            variants: {
                size: 'display-2',
                weight: 'stronger'
            },
            className: 'fl-text-display-2-stronger'
        },
        {
            variants: {
                size: 'title-1',
                weight: 'weaker'
            },
            className: 'fl-text-title-1-weaker'
        },
        {
            variants: {
                size: 'title-1',
                weight: 'default'
            },
            className: 'fl-text-title-1-default'
        },
        {
            variants: {
                size: 'title-1',
                weight: 'stronger'
            },
            className: 'fl-text-title-1-stronger'
        },
        {
            variants: {
                size: 'title-2',
                weight: 'weaker'
            },
            className: 'fl-text-title-2-weaker'
        },
        {
            variants: {
                size: 'title-2',
                weight: 'default'
            },
            className: 'fl-text-title-2-default'
        },
        {
            variants: {
                size: 'title-2',
                weight: 'stronger'
            },
            className: 'fl-text-title-2-stronger'
        },
        {
            variants: {
                size: 'title-3',
                weight: 'weaker'
            },
            className: 'fl-text-title-3-weaker'
        },
        {
            variants: {
                size: 'title-3',
                weight: 'default'
            },
            className: 'fl-text-title-3-default'
        },
        {
            variants: {
                size: 'title-3',
                weight: 'stronger'
            },
            className: 'fl-text-title-3-stronger'
        },
        {
            variants: {
                size: 'heading-1',
                weight: 'weaker'
            },
            className: 'fl-text-heading-1-weaker'
        },
        {
            variants: {
                size: 'heading-1',
                weight: 'default'
            },
            className: 'fl-text-heading-1-default'
        },
        {
            variants: {
                size: 'heading-1',
                weight: 'stronger'
            },
            className: 'fl-text-heading-1-stronger'
        },
        {
            variants: {
                size: 'heading-2',
                weight: 'weaker'
            },
            className: 'fl-text-heading-2-weaker'
        },
        {
            variants: {
                size: 'heading-2',
                weight: 'default'
            },
            className: 'fl-text-heading-2-default'
        },
        {
            variants: {
                size: 'heading-2',
                weight: 'stronger'
            },
            className: 'fl-text-heading-2-stronger'
        },
        {
            variants: {
                size: 'heading-3',
                weight: 'weaker'
            },
            className: 'fl-text-heading-3-weaker'
        },
        {
            variants: {
                size: 'heading-3',
                weight: 'default'
            },
            className: 'fl-text-heading-3-default'
        },
        {
            variants: {
                size: 'heading-3',
                weight: 'stronger'
            },
            className: 'fl-text-heading-3-stronger'
        },
        {
            variants: {
                size: 'body-plus',
                weight: 'weaker'
            },
            className: 'fl-text-body-plus-weaker'
        },
        {
            variants: {
                size: 'body-plus',
                weight: 'default'
            },
            className: 'fl-text-body-plus-default'
        },
        {
            variants: {
                size: 'body-plus',
                weight: 'stronger'
            },
            className: 'fl-text-body-plus-stronger'
        },
        {
            variants: {
                size: 'body',
                weight: 'weaker'
            },
            className: 'fl-text-body-weaker'
        },
        {
            variants: {
                size: 'body',
                weight: 'default'
            },
            className: 'fl-text-body-default'
        },
        {
            variants: {
                size: 'body',
                weight: 'stronger'
            },
            className: 'fl-text-body-stronger'
        },
        {
            variants: {
                size: 'body-minus',
                weight: 'weaker'
            },
            className: 'fl-text-body-minus-weaker'
        },
        {
            variants: {
                size: 'body-minus',
                weight: 'default'
            },
            className: 'fl-text-body-minus-default'
        },
        {
            variants: {
                size: 'body-minus',
                weight: 'stronger'
            },
            className: 'fl-text-body-minus-stronger'
        },
        {
            variants: {
                size: 'label',
                weight: 'weaker'
            },
            className: 'fl-text-label-weaker'
        },
        {
            variants: {
                size: 'label',
                weight: 'default'
            },
            className: 'fl-text-label-default'
        },
        {
            variants: {
                size: 'label',
                weight: 'stronger'
            },
            className: 'fl-text-label-stronger'
        }
    ]
});
export type TextVariants = VariantsOf<typeof text>;
