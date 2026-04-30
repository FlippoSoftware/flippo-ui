import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import type {
    MarginProps
} from '~@lib/types';

import styles from './Text.module.scss';

const TextVariants = cva(styles.Text, {
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
            'body': '',
            'body-minus': '',
            'label': ''
        },
        weight: {
            weaker: '',
            default: '',
            stronger: ''
        },
        color: {
            primary: styles['color-primary'],
            secondary: styles['color-secondary'],
            tertiary: styles['color-tertiary'],
            quaternary: styles['color-quaternary'],
            white: styles['color-white'],
            disabled: styles['color-disabled'],
            brand: styles['color-brand'],
            success: styles['color-success'],
            error: styles['color-error'],
            warning: styles['color-warning']
        },
        align: {
            left: styles['align-left'],
            center: styles['align-center'],
            right: styles['align-right'],
            justify: styles['align-justify']
        },
        transform: {
            none: '',
            uppercase: styles['transform-uppercase'],
            lowercase: styles['transform-lowercase'],
            capitalize: styles['transform-capitalize']
        },
        truncate: {
            true: styles.truncate,
            false: ''
        }
    },
    compoundVariants: [
        // Display-1
        { size: 'display-1', weight: 'default', class: styles['display-1-default'] },
        { size: 'display-1', weight: 'stronger', class: styles['display-1-stronger'] },
        { size: 'display-1', weight: 'weaker', class: styles['display-1-weaker'] },
        // Display-2
        { size: 'display-2', weight: 'default', class: styles['display-2-default'] },
        { size: 'display-2', weight: 'stronger', class: styles['display-2-stronger'] },
        // Title-1
        { size: 'title-1', weight: 'default', class: styles['title-1-default'] },
        { size: 'title-1', weight: 'stronger', class: styles['title-1-stronger'] },
        // Title-2
        { size: 'title-2', weight: 'default', class: styles['title-2-default'] },
        { size: 'title-2', weight: 'stronger', class: styles['title-2-stronger'] },
        // Title-3
        { size: 'title-3', weight: 'default', class: styles['title-3-default'] },
        { size: 'title-3', weight: 'stronger', class: styles['title-3-stronger'] },
        // Heading-1
        { size: 'heading-1', weight: 'default', class: styles['heading-1-default'] },
        { size: 'heading-1', weight: 'stronger', class: styles['heading-1-stronger'] },
        // Heading-2
        { size: 'heading-2', weight: 'default', class: styles['heading-2-default'] },
        { size: 'heading-2', weight: 'weaker', class: styles['heading-2-weaker'] },
        // Heading-3
        { size: 'heading-3', weight: 'default', class: styles['heading-3-default'] },
        { size: 'heading-3', weight: 'stronger', class: styles['heading-3-stronger'] },
        // Body-plus
        { size: 'body-plus', weight: 'default', class: styles['body-plus-default'] },
        { size: 'body-plus', weight: 'stronger', class: styles['body-plus-stronger'] },
        // Body
        { size: 'body', weight: 'default', class: styles['body-default'] },
        { size: 'body', weight: 'stronger', class: styles['body-stronger'] },
        { size: 'body', weight: 'weaker', class: styles['body-weaker'] },
        // Body-minus
        { size: 'body-minus', weight: 'default', class: styles['body-minus-default'] },
        { size: 'body-minus', weight: 'stronger', class: styles['body-minus-stronger'] },
        { size: 'body-minus', weight: 'weaker', class: styles['body-minus-weaker'] },
        // Label
        { size: 'label', weight: 'default', class: styles['label-default'] },
        { size: 'label', weight: 'stronger', class: styles['label-stronger'] },
        { size: 'label', weight: 'weaker', class: styles['label-weaker'] }
    ],
    defaultVariants: {
        size: 'body',
        weight: 'default',
        color: 'primary',
        transform: 'none',
        truncate: false
    }
});

/**
 * Text - Typography component for rendering text with predefined styles.
 * Supports margin props but not padding (as per Radix design principles).
 *
 * @example
 * <Text size="heading-1" weight="stronger">Title</Text>
 *
 * @example
 * <Text size="body" color="tertiary" align="center">Subtitle</Text>
 *
 * @example
 * <Text as="span" size="label" color="brand" truncate>Long text...</Text>
 */
export function Text<ElementType extends keyof React.JSX.IntrinsicElements = 'span'>(
    props: Text.Props<ElementType>
) {
    const {
        as: Tag = 'span',
        ref,
        size = 'body',
        weight = 'default',
        color = 'primary',
        align,
        transform = 'none',
        truncate = false,
        className,
        // Margin props (Radix design principle: Text gets margin but not padding)
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml,
        style,
        ...otherProps
    } = props;

    const textClassName = TextVariants({
        size,
        weight,
        color,
        align,
        transform,
        truncate,
        className
    });

    const textStyle: React.CSSProperties = {
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        ...style
    };

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ className: textClassName, style: textStyle }, otherProps]
    });

    return element;
}

export type TextProps<ElementType extends keyof React.JSX.IntrinsicElements = 'span'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & MarginProps
    & {
        /** HTML element to render */
        as?: ElementType;
        /** Text size variant */
        size?: Text.Size;
        /** Text weight variant */
        weight?: Text.Weight;
        /** Text color variant */
        color?: Text.Color;
        /** Text alignment */
        align?: Text.Align;
        /** Text transform */
        transform?: Text.Transform;
        /** Truncate with ellipsis */
        truncate?: boolean;
        /** Additional CSS class */
        className?: string;
    };

export namespace Text {

    /**
     * Text size variants (based on _font.scss mixins)
     */
    export type Size
        = | 'display-1' | 'display-2'
          | 'title-1' | 'title-2' | 'title-3'
          | 'heading-1' | 'heading-2' | 'heading-3'
          | 'body-plus' | 'body' | 'body-minus'
          | 'label';

    /**
     * Text weight variants
     */
    export type Weight = 'weaker' | 'default' | 'stronger';

    /**
     * Text color variants
     */
    export type Color
        = | 'primary' | 'secondary' | 'tertiary' | 'quaternary'
          | 'white' | 'disabled'
          | 'brand' | 'success' | 'error' | 'warning';

    /**
     * Text alignment
     */
    export type Align = 'left' | 'center' | 'right' | 'justify';

    /**
     * Text transform
     */
    export type Transform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'span'> = TextProps<ElementType>;
}
