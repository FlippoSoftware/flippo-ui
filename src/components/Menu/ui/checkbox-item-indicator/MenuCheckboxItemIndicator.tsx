import React from 'react';

import { Menu as MenuHeadless } from '@flippo-ui/headless-components/menu';
import { cx } from 'class-variance-authority';

import styles from './MenuCheckboxItemIndicator.module.scss';

export function MenuCheckboxItemIndicator(props: MenuCheckboxItemIndicator.Props) {
    const { className, ...otherProps } = props;

    return <MenuHeadless.CheckboxItemIndicator {...otherProps} className={cx(styles.MenuCheckboxItemIndicator, className)} />;
}

MenuCheckboxItemIndicator.Svg = CheckSvg;

export namespace MenuCheckboxItemIndicator {
    export type Props = MenuHeadless.CheckboxItemIndicator.Props;
}

function CheckSvg(props: React.ComponentProps<'svg'>) {
    const { className, ...otherProps } = props;

    return (
        <svg viewBox={'0 0 16 16'} fill={'none'} {...otherProps} className={cx(styles.CheckIcon, className)}>
            <path d={'M13.5 4.5L6 12L2.5 8.5'} stroke={'currentColor'} strokeWidth={2} strokeLinecap={'round'} strokeLinejoin={'round'} />
        </svg>
    );
}
