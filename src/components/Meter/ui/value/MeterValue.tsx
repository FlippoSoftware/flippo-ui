import React from 'react';

import { Meter as MeterHeadless } from '@flippo-ui/headless-components/meter';
import { cx } from 'class-variance-authority';

import styles from './MeterValue.module.scss';

export function MeterValue(props: MeterValue.Props) {
    const { className, ...otherProps } = props;

    return <MeterHeadless.Value {...otherProps} className={cx(styles.MeterValue, className)} />;
}

export namespace MeterValue {
    export type Props = MeterHeadless.Value.Props;
}
