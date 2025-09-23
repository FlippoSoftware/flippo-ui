import React from 'react';

import { Tabs as TabsHeadless } from '@flippo-ui/headless-components/tabs';
import { cx } from 'class-variance-authority';

import styles from './TabsPanel.module.scss';

export function TabsPanel(props: TabsPanel.Props) {
    const { className, ...otherProps } = props;

    return <TabsHeadless.Panel {...otherProps} className={cx(styles.TabsPanel, className)} />;
}

export namespace TabsPanel {
    export type Props = TabsHeadless.Panel.Props;
}
