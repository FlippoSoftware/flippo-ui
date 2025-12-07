import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';
import { cx } from 'class-variance-authority';

import styles from './DrawerBackdrop.module.scss';

export function DrawerBackdrop(props: DrawerBackdrop.Props) {
    const { className, ...otherProps } = props;

    return <DrawerHeadless.Backdrop {...otherProps} className={cx(styles.DrawerBackdrop, className)} />;
}

export namespace DrawerBackdrop {
    export type Props = DrawerHeadless.Backdrop.Props;
}
