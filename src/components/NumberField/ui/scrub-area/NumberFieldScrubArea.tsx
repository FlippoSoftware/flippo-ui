import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldScrubArea.module.scss';

export function NumberFieldScrubArea(props: NumberFieldScrubArea.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.ScrubArea {...otherProps} className={cx(styles.NumberFieldScrubArea, className)} />;
}

export namespace NumberFieldScrubArea {
    export type Props = NumberFieldHeadless.ScrubArea.Props;
}
