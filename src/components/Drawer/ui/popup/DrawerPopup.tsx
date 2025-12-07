import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';
import { cx } from 'class-variance-authority';

import styles from './DrawerPopup.module.scss';

export function DrawerPopup(props: DrawerPopup.Props) {
    const { className, ...otherProps } = props;

    return <DrawerHeadless.Popup {...otherProps} className={cx(styles.DrawerPopup, className)} />;
}

export namespace DrawerPopup {
    export type Props = DrawerHeadless.Popup.Props;
}
