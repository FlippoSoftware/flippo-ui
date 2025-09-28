import React from 'react';

import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';
import { cx } from 'class-variance-authority';

import styles from './DialogDescription.module.scss';

export function DialogDescription(props: DialogDescription.Props) {
    const { className, ...otherProps } = props;

    return <DialogHeadless.Description {...otherProps} className={cx(styles.DialogDescription, className)} />;
}

export namespace DialogDescription {
    export type Props = DialogHeadless.Description.Props;
}
