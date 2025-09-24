import React from 'react';

import { Tooltip as TooltipHeadless } from '@flippo-ui/headless-components/tooltip';
import { cx } from 'class-variance-authority';

import styles from './TooltipPopup.module.scss';

export function TooltipPopup(props: TooltipPopup.Props) {
    const {
        className,
        ...otherProps
    } = props;

    return <TooltipHeadless.Popup {...otherProps} className={cx(styles.Popup, className)} />;
}

export namespace TooltipPopup {
    export type Props = TooltipHeadless.Popup.Props;
}
