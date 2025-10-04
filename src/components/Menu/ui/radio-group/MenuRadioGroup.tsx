import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuRadioGroup.module.scss';

export function MenuRadioGroup(props: MenuRadioGroup.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.RadioGroup {...otherProps} className={cx(styles.MenuRadioGroup, className)} />;
}

export namespace MenuRadioGroup {
    export type Props = MenuHeadless.RadioGroup.Props;
}
