import React from 'react';

import { Checkbox as CheckboxHeadless } from '@flippo-ui/headless-components/checkbox';
import { cx } from 'class-variance-authority';

import styles from './CheckboxIndicator.module.scss';

export function CheckboxIndicator(props: CheckboxIndicator.Props) {
    const { className, ...otherProps } = props;

    return (
        <CheckboxHeadless.Indicator {...otherProps} className={cx(styles.CheckboxIndicator, className)} />
    );
}

CheckboxIndicator.Svg = CheckSvg;

export namespace CheckboxIndicator {
    export type Props = CheckboxHeadless.Indicator.Props;
}

function CheckSvg() {
    return (
        <svg viewBox={'0 0 16 16'} fill={'none'} className={styles.CheckIcon}>
            <path d={'M13.5 4.5L6 12L2.5 8.5'} stroke={'currentColor'} strokeWidth={2} strokeLinecap={'round'} strokeLinejoin={'round'} />
        </svg>
    );
}
