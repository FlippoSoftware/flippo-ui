import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuRadioItemIndicator.module.scss';

export function MenuRadioItemIndicator(props: MenuRadioItemIndicator.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.RadioItemIndicator {...otherProps} className={cx(styles.MenuRadioItemIndicator, className)} />;
}

MenuRadioItemIndicator.Svg = RadioSvg;

export namespace MenuRadioItemIndicator {
    export type Props = MenuHeadless.RadioItemIndicator.Props;
}

function RadioSvg(props: React.ComponentProps<'span'>) {
    const { className, ...otherProps } = props;

    return <span {...otherProps} className={cx(styles.RadioIcon, className)} />;
}
