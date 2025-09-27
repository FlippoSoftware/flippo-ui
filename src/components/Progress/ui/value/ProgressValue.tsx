import React from 'react';

import { Progress as ProgressHeadless } from '@flippo-ui/headless-components/progress';
import { cx } from 'class-variance-authority';

import styles from './ProgressValue.module.scss';

export function ProgressValue(props: ProgressValue.Props) {
    const { className, ...otherProps } = props;

    return <ProgressHeadless.Value {...otherProps} className={cx(styles.ProgressValue, className)} />;
}

export namespace ProgressValue {
    export type Props = ProgressHeadless.Value.Props;
}
