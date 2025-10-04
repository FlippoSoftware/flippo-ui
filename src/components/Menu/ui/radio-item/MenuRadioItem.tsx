import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuRadioItem.module.scss';

export function MenuRadioItem(props: MenuRadioItem.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.RadioItem {...otherProps} className={cx(styles.MenuRadioItem, className)} />;
}

export namespace MenuRadioItem {
    export type Props = MenuHeadless.RadioItem.Props;
}
