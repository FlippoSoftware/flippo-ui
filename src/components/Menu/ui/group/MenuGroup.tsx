import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuGroup.module.scss';

export function MenuGroup(props: MenuGroup.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.Group {...otherProps} className={cx(styles.MenuGroup, className)} />;
}

export namespace MenuGroup {
    export type Props = MenuHeadless.Group.Props;
}
