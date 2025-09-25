import React from 'react';

import { Radio as RadioHeadless } from '@flippo-ui/headless-components/radio';
import { cx } from 'class-variance-authority';

import styles from './RadioIndicator.module.scss';

export function RadioIndicator(props: RadioIndicator.Props) {
    const { className, ...otherProps } = props;

    return <RadioHeadless.Indicator {...otherProps} className={cx(styles.RadioIndicator, className)} />;
}

export namespace RadioIndicator {
    export type Props = RadioHeadless.Indicator.Props;
}
