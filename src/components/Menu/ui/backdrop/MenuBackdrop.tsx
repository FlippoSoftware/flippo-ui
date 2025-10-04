import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuBackdrop.module.scss';

export function MenuBackdrop(props: MenuBackdrop.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.Backdrop {...otherProps} className={cx(styles.MenuBackdrop, className)} />;
}

export namespace MenuBackdrop {
    export type Props = MenuHeadless.Backdrop.Props;
}
