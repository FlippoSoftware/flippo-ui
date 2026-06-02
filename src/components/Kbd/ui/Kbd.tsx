import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './Kbd.module.scss';

const KbdVariants = cva(styles.Kbd, {
    variants: {
        size: {
            '1': styles['size-1'],
            '2': styles['size-2'],
            '3': styles['size-3'],
            '4': styles['size-4'],
            '5': styles['size-5'],
            '6': styles['size-6'],
            '7': styles['size-7'],
            '8': styles['size-8'],
            '9': styles['size-9']
        },
        variant: {
            outline: styles['variant-outline'],
            soft: styles['variant-soft'],
            ghost: styles['variant-ghost']
        }
    },
    defaultVariants: {
        size: '2',
        variant: 'outline'
    }
});

/**
 * Kbd — keyboard input element. Renders `<kbd>` with keyboard-key styling.
 *
 * Sizes follow a 1–9 scale (matching Code and Radix conventions).
 * Variants control the visual treatment.
 *
 * @example
 * <Text>Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open search.</Text>
 *
 * @example
 * // Soft variant, larger size
 * <Kbd size="4" variant="soft">Enter</Kbd>
 */
export function Kbd(props: Kbd.Props) {
    const { as: Tag = 'kbd', ref, size, variant, className, ...otherProps } = props;

    const kbdClassName = KbdVariants({ size, variant, className });

    const element = useRender({
        defaultTagName: Tag,
        ref,
        props: [{ className: kbdClassName }, otherProps]
    });

    return element;
}

export type KbdProps = VariantProps<typeof KbdVariants> & {
    /** HTML element to render */
    as?: React.ElementType;
    /** Additional CSS class */
    className?: string;
    children?: React.ReactNode;
};

export namespace Kbd {
    export type Size = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    export type Variant = 'outline' | 'soft' | 'ghost';
    export type Props = KbdProps & React.ComponentPropsWithRef<'kbd'>;
}
