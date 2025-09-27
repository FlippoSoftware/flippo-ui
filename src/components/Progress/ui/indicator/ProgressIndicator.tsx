import React from 'react';

import { Progress as ProgressHeadless } from '@flippo-ui/headless-components/progress';
import { cx } from 'class-variance-authority';

import styles from './ProgressIndicator.module.scss';

export function ProgressIndicator(props: ProgressIndicator.Props) {
    const { className, ...otherProps } = props;

    return <ProgressHeadless.Indicator {...otherProps} className={cx(styles.ProgressIndicator, className)} />;
}

export namespace ProgressIndicator {
    export type Props = ProgressHeadless.Indicator.Props;
}
