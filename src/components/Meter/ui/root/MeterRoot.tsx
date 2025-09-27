import React from 'react';

import { Meter as MeterHeadless } from '@flippo-ui/headless-components/meter';
import { cx } from 'class-variance-authority';

import styles from './MeterRoot.module.scss';

export function MeterRoot(props: MeterRoot.Props) {
    const { className, ...otherProps } = props;

    return <MeterHeadless.Root {...otherProps} className={cx(styles.MeterRoot, className)} />;
}

export namespace MeterRoot {
    export type Props = MeterHeadless.Root.Props;
}
