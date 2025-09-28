import React from 'react';

import { Menubar as MenubarHeadless } from '@flippo-ui/headless-components/menubar';
import { cx } from 'class-variance-authority';

import styles from './Menubar.module.scss';

export function Menubar(props: Menubar.Props) {
    const { className, ...otherProps } = props;

    return <MenubarHeadless {...otherProps} className={cx(styles.Menubar, className)} />;
}

export namespace Menubar {
    export type Props = MenubarHeadless.Props;
}
