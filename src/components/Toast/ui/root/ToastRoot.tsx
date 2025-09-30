import React from 'react';

import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';
import { cx } from 'class-variance-authority';

import styles from './ToastRoot.module.scss';

export function ToastRoot(props: ToastRoot.Props) {
    const { className, ...otherProps } = props;

    return <ToastHeadless.Root {...otherProps} className={cx(styles.ToastRoot, className)} />;
}

export namespace ToastRoot {
    export type Props = ToastHeadless.Root.Props;
}
