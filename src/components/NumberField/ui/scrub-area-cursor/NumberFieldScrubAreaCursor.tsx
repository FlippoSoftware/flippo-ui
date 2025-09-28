import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldScrubAreaCursor.module.scss';

export function NumberFieldScrubAreaCursor(props: NumberFieldScrubAreaCursor.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.ScrubAreaCursor {...otherProps} className={cx(styles.NumberFieldScrubAreaCursor, className)} />;
}

export namespace NumberFieldScrubAreaCursor {
    export type Props = NumberFieldHeadless.ScrubAreaCursor.Props;
}
