import React from 'react';

import { Progress as ProgressHeadless } from '@flippo-ui/headless-components/progress';
import { cx } from 'class-variance-authority';

import styles from './ProgressLabel.module.scss';

export function ProgressLabel(props: ProgressLabel.Props) {
    const { className, ...otherProps } = props;

    return <ProgressHeadless.Label {...otherProps} className={cx(styles.ProgressLabel, className)} />;
}

export namespace ProgressLabel {
    export type Props = ProgressHeadless.Label.Props;
}
