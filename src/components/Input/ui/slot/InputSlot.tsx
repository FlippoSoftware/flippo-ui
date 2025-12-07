import React from 'react';

import { Input as InputHeadless } from '@flippo-ui/headless-components/input';
import { cx } from 'class-variance-authority';

import styles from './InputSlot.module.scss';

export function InputSlot(props: InputSlot.Props) {
    const { className, ...otherProps } = props;

    return <InputHeadless.Slot {...otherProps} className={cx(styles.InputSlot, className)} />;
}

export namespace InputSlot {
    export type Props = InputHeadless.Props;
}
