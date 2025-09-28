import React from 'react';

import { Toolbar as ToolbarHeadless } from '@flippo-ui/headless-components/toolbar';
import { cx } from 'class-variance-authority';

import styles from './ToolbarSeparator.module.scss';

export function ToolbarSeparator(props: ToolbarSeparator.Props) {
    const { className, ...otherProps } = props;

    return <ToolbarHeadless.Separator {...otherProps} className={cx(styles.ToolbarSeparator, className)} />;
}

export namespace ToolbarSeparator {
    export type Props = ToolbarHeadless.Separator.Props;
}
