import React from 'react';

import { Checkbox as CheckboxHeadless } from '@flippo-ui/headless-components/checkbox';
import { cva } from 'class-variance-authority';

import styles from './CheckboxRoot.module.scss';

const CheckboxRootVariants = cva(styles.CheckboxRoot, {
    variants: {
        size: {
            sm: styles.CheckboxRoot_sm,
            md: styles.CheckboxRoot_md,
            lg: styles.CheckboxRoot_lg
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

export function CheckboxRoot(props: CheckboxRoot.Props) {
    const { className, size, ...rest } = props;

    const checkboxClasses = CheckboxRootVariants({ size, className });

    return <CheckboxHeadless.Root {...rest} className={checkboxClasses} />;
}

export namespace CheckboxRoot {
    export type Props = {
        size?: 'sm' | 'md' | 'lg';
    } & CheckboxHeadless.Root.Props;
}
