import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';
import { cx } from 'class-variance-authority';

import styles from './ToastTitle.module.scss';

export function ToastTitle(props: ToastTitle.Props) {
    const { className, ...otherProps } = props;

    return <ToastHeadless.Title {...otherProps} className={cx(styles.ToastTitle, className)} />;
}

export namespace ToastTitle {
    export type Props = ToastHeadless.Title.Props;
}
