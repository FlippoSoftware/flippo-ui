import React from 'react';

import { Collapsible as CollapsibleHeadless } from '@flippo-ui/headless-components/collapsible';
import { cx } from 'class-variance-authority';

import styles from './CollapsiblePanel.module.scss';

export function CollapsiblePanel(props: CollapsiblePanel.Props) {
    const { className, ...otherProps } = props;

    return <CollapsibleHeadless.Panel {...otherProps} className={cx(styles.CollapsiblePanel, className)} />;
}

export namespace CollapsiblePanel {
    export type Props = CollapsibleHeadless.Panel.Props;
}
