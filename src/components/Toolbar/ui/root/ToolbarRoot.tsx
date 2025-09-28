import React from 'react';

import { Toolbar as ToolbarHeadless } from '@flippo-ui/headless-components/toolbar';
import { cx } from 'class-variance-authority';

import styles from './ToolbarRoot.module.scss';

export function ToolbarRoot(props: ToolbarRoot.Props) {
    const { className, ...otherProps } = props;

    return <ToolbarHeadless.Root {...otherProps} className={cx(styles.ToolbarRoot, className)} />;
}

export namespace ToolbarRoot {
    export type Props = ToolbarHeadless.Root.Props;
}
