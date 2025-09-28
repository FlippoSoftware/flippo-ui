import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';
import { cx } from 'class-variance-authority';

import styles from './DialogTitle.module.scss';

export function DialogTitle(props: DialogTitle.Props) {
    const { className, ...otherProps } = props;

    return <DialogHeadless.Title {...otherProps} className={cx(styles.DialogTitle, className)} />;
}

export namespace DialogTitle {
    export type Props = DialogHeadless.Title.Props;
}
