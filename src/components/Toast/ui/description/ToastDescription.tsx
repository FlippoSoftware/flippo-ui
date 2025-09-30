import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';
import { cx } from 'class-variance-authority';

import styles from './ToastDescription.module.scss';

export function ToastDescription(props: ToastDescription.Props) {
    const { className, ...otherProps } = props;

    return <ToastHeadless.Description {...otherProps} className={cx(styles.ToastDescription, className)} />;
}

export namespace ToastDescription {
    export type Props = ToastHeadless.Description.Props;
}
