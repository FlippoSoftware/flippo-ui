import React from 'react';

import { Popover as PopoverHeadless } from '@flippo-ui/headless-components/popover';
import { cx } from 'class-variance-authority';

import styles from './PopoverPopup.module.scss';

export function PopoverPopup(props: PopoverPopup.Props) {
    const { className, ...otherProps } = props;

    return <PopoverHeadless.Popup {...otherProps} className={cx(styles.PopoverPopup, className)} />;
}

export namespace PopoverPopup {
    export type Props = PopoverHeadless.Popup.Props;
}
