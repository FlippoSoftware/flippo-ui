import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuCheckboxItem.module.scss';

export function MenuCheckboxItem(props: MenuCheckboxItem.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.CheckboxItem {...otherProps} className={cx(styles.MenuCheckboxItem, className)} />;
}

export namespace MenuCheckboxItem {
    export type Props = MenuHeadless.CheckboxItem.Props;
}
