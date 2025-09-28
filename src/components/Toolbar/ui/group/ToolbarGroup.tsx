import React from 'react';

import { Toolbar as ToolbarHeadless } from '@flippo-ui/headless-components/toolbar';
import { cx } from 'class-variance-authority';

import styles from './ToolbarGroup.module.scss';

export function ToolbarGroup(props: ToolbarGroup.Props) {
    const { className, ...otherProps } = props;

    return <ToolbarHeadless.Group {...otherProps} className={cx(styles.ToolbarGroup, className)} />;
}

export namespace ToolbarGroup {
    export type Props = ToolbarHeadless.Group.Props;
}
