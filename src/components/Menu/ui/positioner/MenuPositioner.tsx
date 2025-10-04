import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuPositioner.module.scss';

export function MenuPositioner(props: MenuPositioner.Props) {
    const { className, sideOffset = 8, ...otherProps } = props;

    return <MenuHeadless.Positioner {...otherProps} sideOffset={sideOffset} className={cx(styles.MenuPositioner, className)} />;
}

export namespace MenuPositioner {
    export type Props = MenuHeadless.Positioner.Props;
}
