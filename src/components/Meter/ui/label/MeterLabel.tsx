import React from 'react';

import { Meter as MeterHeadless } from '@flippo-ui/headless-components/meter';
import { cx } from 'class-variance-authority';

import styles from './MeterLabel.module.scss';

export function MeterLabel(props: MeterLabel.Props) {
    const { className, ...otherProps } = props;

    return <MeterHeadless.Label {...otherProps} className={cx(styles.MeterLabel, className)} />;
}

export namespace MeterLabel {
    export type Props = MeterHeadless.Label.Props;
}
