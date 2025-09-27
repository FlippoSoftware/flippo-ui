import React from 'react';

import { Meter as MeterHeadless } from '@flippo-ui/headless-components/meter';
import { cx } from 'class-variance-authority';

import styles from './MeterTrack.module.scss';

export function MeterTrack(props: MeterTrack.Props) {
    const { className, ...otherProps } = props;

    return <MeterHeadless.Track {...otherProps} className={cx(styles.MeterTrack, className)} />;
}

export namespace MeterTrack {
    export type Props = MeterHeadless.Track.Props;
}
