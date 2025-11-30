import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';
import { cx } from 'class-variance-authority';

import styles from './DrawerDrag.module.scss';

export function DrawerDrag(props: DrawerDrag.Props) {
    const { className, ...otherProps } = props;

    return <DrawerHeadless.Drag {...otherProps} className={cx(styles.DrawerDrag, className)} />;
}

export namespace DrawerDrag {
    export type Props = DrawerHeadless.Drag.Props;
}

