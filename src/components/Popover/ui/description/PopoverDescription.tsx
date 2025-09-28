import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';
import { cx } from 'class-variance-authority';

import styles from './PopoverDescription.module.scss';

export function PopoverDescription(props: PopoverDescription.Props) {
    const { className, ...otherProps } = props;

    return <PopoverHeadless.Description {...otherProps} className={cx(styles.PopoverDescription, className)} />;
}

export namespace PopoverDescription {
    export type Props = PopoverHeadless.Description.Props;
}
