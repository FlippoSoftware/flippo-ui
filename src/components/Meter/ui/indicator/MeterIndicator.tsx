import React from 'react';

import { Meter as MeterHeadless } from '@flippo-ui/headless-components/meter';
import { cx } from 'class-variance-authority';

import styles from './MeterIndicator.module.scss';

export function MeterIndicator(props: MeterIndicator.Props) {
    const { className, ...otherProps } = props;

    return <MeterHeadless.Indicator {...otherProps} className={cx(styles.MeterIndicator, className)} />;
}

export namespace MeterIndicator {
    export type Props = MeterHeadless.Indicator.Props;
}
