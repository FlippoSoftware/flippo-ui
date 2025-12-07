import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';
import { cx } from 'class-variance-authority';

import styles from './DrawerTitle.module.scss';

export function DrawerTitle(props: DrawerTitle.Props) {
    const { className, ...otherProps } = props;

    return <DrawerHeadless.Title {...otherProps} className={cx(styles.DrawerTitle, className)} />;
}

export namespace DrawerTitle {
    export type Props = DrawerHeadless.Title.Props;
}


