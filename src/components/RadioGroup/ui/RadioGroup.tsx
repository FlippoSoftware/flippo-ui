import React from 'react';

import { RadioGroup as RadioGroupHeadless } from '@flippo-ui/headless-components/radio-group';
import { cx } from 'class-variance-authority';

import styles from './RadioGroup.module.scss';

export function RadioGroup(props: RadioGroup.Props) {
    const { className, ...otherProps } = props;

    return <RadioGroupHeadless {...otherProps} className={cx(styles.RadioGroup, className)} />;
}

export namespace RadioGroup {
    export type Props = RadioGroupHeadless.Props;
}
