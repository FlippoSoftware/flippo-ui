import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import type { MarginProps } from '~@lib/types';

import styles from './Blockquote.module.scss';

const BlockquoteVariants = cva(styles.Blockquote, {
    variants: {
        size: {
            1: styles['size-1'],
            2: styles['size-2'],
            3: styles['size-3']
        },
        color: {
            primary: styles['color-primary'],
            brand: styles['color-brand'],
            success: styles['color-success'],
            warning: styles['color-warning'],
            error: styles['color-error']
        }
    },
    defaultVariants: {
        size: 2,
        color: 'brand'
    }
});

/**
 * Blockquote — block-level quotation with a coloured left border.
 *
 * Sizes 1–3 control padding and font size.
 * Place a `<cite>` element inside for attribution — it is styled automatically.
 *
 * @example
 * <Blockquote size="2" color="brand">
 *   Any sufficiently advanced technology is indistinguishable from magic.
 *   <cite>Arthur C. Clarke</cite>
 * </Blockquote>
 *
 * @example
 * // Warning blockquote
 * <Blockquote color="warning" size="1">
 *   This feature is deprecated.
 * </Blockquote>
 */
export function Blockquote(props: Blockquote.Props) {
    const {
        as: Tag = 'blockquote',
        ref,
        size,
        color,
        className,
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

    const blockquoteClassName = BlockquoteVariants({ size, color, className });

    const blockquoteStyle: React.CSSProperties = {
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        ...style
    };

    const element = useRender({
        defaultTagName: Tag,
        ref,
        props: [{ className: blockquoteClassName, style: blockquoteStyle }, otherProps]
    });

    return element;
}

export type BlockquoteProps<ElementType extends keyof React.JSX.IntrinsicElements = 'blockquote'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & VariantProps<typeof BlockquoteVariants>
    & MarginProps
    & {
        /** HTML element to render */
        as?: ElementType;
        /** Additional CSS class */
        className?: string;
    };

export namespace Blockquote {
    export type Size = '1' | '2' | '3';
    export type Color = 'primary' | 'brand' | 'success' | 'warning' | 'error';
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'blockquote'> = BlockquoteProps<ElementType>;
}
