import React from 'react';

import { Separator as SeparatorHeadless } from '@flippo-ui/headless-components/separator';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './Separator.module.scss';

const SeparatorVariants = cva(styles.Separator, {
    variants: {
        spacing: {
            4: styles['spacing-4'],
            6: styles['spacing-6'],
            8: styles['spacing-8'],
            10: styles['spacing-10'],
            12: styles['spacing-12']
        }
    }
});

export function Separator(props: Separator.Props) {
    const { spacing, className, ...otherProps } = props;

    const separatorClassName = SeparatorVariants({
        spacing,
        className
    });

    return <SeparatorHeadless {...otherProps} className={separatorClassName} />;
}

export namespace Separator {
    export type Props = SeparatorHeadless.Props & VariantProps<typeof SeparatorVariants>;
}
