import React from 'react';

import { Switch as SwitchHeadless } from '@flippo-ui/headless-components/switch';
import { cva } from 'class-variance-authority';

import styles from './SwitchRoot.module.scss';

const SwitchRootVariants = cva(styles.SwitchRoot, {
    variants: {
        size: {
            sm: styles.SwitchRoot_sm,
            md: styles.SwitchRoot_md,
            lg: styles.SwitchRoot_lg
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

export function SwitchRoot(props: SwitchRoot.Props) {
    const { className, size, ...rest } = props;

    const switchClasses = SwitchRootVariants({ size, className });

    return <SwitchHeadless.Root {...rest} className={switchClasses} />;
}

export namespace SwitchRoot {
    export type Props = {
        size?: 'sm' | 'md' | 'lg';
    } & SwitchHeadless.Root.Props;
}
