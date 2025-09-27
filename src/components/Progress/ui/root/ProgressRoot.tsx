import React from 'react';

import { Progress as ProgressHeadless } from '@flippo-ui/headless-components/progress';
import { cx } from 'class-variance-authority';

import styles from './ProgressRoot.module.scss';

export function ProgressRoot(props: ProgressRoot.Props) {
    const { className, ...otherProps } = props;

    return <ProgressHeadless.Root {...otherProps} className={cx(styles.ProgressRoot, className)} />;
}

export namespace ProgressRoot {
    export type Props = ProgressHeadless.Root.Props;
}
