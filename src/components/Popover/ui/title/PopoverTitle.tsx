import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';
import { cx } from 'class-variance-authority';

import styles from './PopoverTitle.module.scss';

export function PopoverTitle(props: PopoverTitle.Props) {
    const { className, ...otherProps } = props;

    return <PopoverHeadless.Title {...otherProps} className={cx(styles.PopoverTitle, className)} />;
}

export namespace PopoverTitle {
    export type Props = PopoverHeadless.Title.Props;
}
