import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuGroupLabel.module.scss';

export function MenuGroupLabel(props: MenuGroupLabel.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.GroupLabel {...otherProps} className={cx(styles.MenuGroupLabel, className)} />;
}

export namespace MenuGroupLabel {
    export type Props = MenuHeadless.GroupLabel.Props;
}
