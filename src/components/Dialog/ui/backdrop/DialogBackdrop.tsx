import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';
import { cx } from 'class-variance-authority';

import styles from './DialogBackdrop.module.scss';

export function DialogBackdrop(props: DialogBackdrop.Props) {
    const { className, ...otherProps } = props;

    return <DialogHeadless.Backdrop {...otherProps} className={cx(styles.DialogBackdrop, className)} />;
}

export namespace DialogBackdrop {
    export type Props = DialogHeadless.Backdrop.Props;
}
