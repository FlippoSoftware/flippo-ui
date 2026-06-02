import React from 'react';

import { ArrowOutwardIcon } from '@flippo-ui/icons';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './Link.module.scss';

const LinkVariants = cva(styles.Link, {
    variants: {
        variant: {
            neutral: styles.Link_neutral,
            brand: styles.Link_brand
        }
    },
    defaultVariants: {
        variant: 'neutral'
    }
});

export function Link(props: Link.Props) {
    const {
        children,
        variant = 'neutral',
        className,
        withArrow = true,
        ...otherProps
    } = props;

    const linkClassName = LinkVariants({
        variant,
        className
    });

    return (
        <a {...otherProps} className={linkClassName}>
            <span className={styles.text}>{children}</span>
            {withArrow && <ArrowOutwardIcon />}
        </a>
    );
}

export namespace Link {
    export type Props = VariantProps<typeof LinkVariants> & React.ComponentPropsWithRef<'a'> & {withArrow?: boolean};
}
