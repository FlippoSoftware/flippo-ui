import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';
import { cx } from 'class-variance-authority';

import styles from './ToastAction.module.scss';

export function ToastAction(props: ToastAction.Props) {
    const { className, ...otherProps } = props;

    return <ToastHeadless.Action {...otherProps} className={cx(styles.ToastAction, className)} />;
}

export namespace ToastAction {
    export type Props = ToastHeadless.Action.Props;
}
