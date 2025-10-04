import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuPopup.module.scss';

export function MenuPopup(props: MenuPopup.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.Popup {...otherProps} className={cx(styles.MenuPopup, className)} />;
}

export namespace MenuPopup {
    export type Props = MenuHeadless.Popup.Props;
}
