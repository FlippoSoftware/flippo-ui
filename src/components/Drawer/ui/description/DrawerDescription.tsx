import React from 'react';

import { Drawer as DrawerHeadless } from '@flippo-ui/headless-components/drawer';
import { cx } from 'class-variance-authority';

import styles from './DrawerDescription.module.scss';

export function DrawerDescription(props: DrawerDescription.Props) {
    const { className, ...otherProps } = props;

    return <DrawerHeadless.Description {...otherProps} className={cx(styles.DrawerDescription, className)} />;
}

export namespace DrawerDescription {
    export type Props = DrawerHeadless.Description.Props;
}


