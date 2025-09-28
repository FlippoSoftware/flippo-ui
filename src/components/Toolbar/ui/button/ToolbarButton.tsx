import React from 'react';

import { Toolbar as ToolbarHeadless } from '@flippo-ui/headless-components/toolbar';
import { cx } from 'class-variance-authority';

import styles from './ToolbarButton.module.scss';

export function ToolbarButton(props: ToolbarButton.Props) {
    const { className, ...otherProps } = props;

    return <ToolbarHeadless.Button {...otherProps} className={cx(styles.ToolbarButton, className)} />;
}

export namespace ToolbarButton {
    export type Props = ToolbarHeadless.Button.Props;
}
