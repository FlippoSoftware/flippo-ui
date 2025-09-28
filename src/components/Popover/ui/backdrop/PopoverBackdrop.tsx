import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';
import { cx } from 'class-variance-authority';

import styles from './PopoverBackdrop.module.scss';

export function PopoverBackdrop(props: PopoverBackdrop.Props) {
    const { className, ...otherProps } = props;

    return <PopoverHeadless.Backdrop {...otherProps} className={cx(styles.PopoverBackdrop, className)} />;
}

export namespace PopoverBackdrop {
    export type Props = PopoverHeadless.Backdrop.Props;
}
