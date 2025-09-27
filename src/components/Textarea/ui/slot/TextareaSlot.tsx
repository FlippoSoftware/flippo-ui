import React from 'react';

import { Textarea as TextareaHeadless } from '@flippo-ui/headless-components/textarea';
import { cx } from 'class-variance-authority';

import styles from './TextareaSlot.module.scss';

export function TextareaSlot(props: TextareaSlot.Props) {
    const { className, ...otherProps } = props;

    return <TextareaHeadless.Slot {...otherProps} className={cx(styles.TextareaSlot, className)} />;
}

export namespace TextareaSlot {
    export type Props = TextareaHeadless.Props;
}
