import React from 'react';

import { Toolbar as ToolbarHeadless } from '@flippo-ui/headless-components/toolbar';
import { cx } from 'class-variance-authority';

import styles from './ToolbarLink.module.scss';

export function ToolbarLink(props: ToolbarLink.Props) {
    const { className, ...otherProps } = props;

    return <ToolbarHeadless.Link {...otherProps} className={cx(styles.ToolbarLink, className)} />;
}

export namespace ToolbarLink {
    export type Props = ToolbarHeadless.Link.Props;
}
