import React from 'react';

import { Tabs as TabsHeadless } from '@flippo-ui/headless-components/tabs';
import { cx } from 'class-variance-authority';

import styles from './TabsTab.module.scss';

export function TabsTab(props: TabsTab.Props) {
    const { className, ...otherProps } = props;

    return <TabsHeadless.Tab {...otherProps} className={cx(styles.TabsTab, className)} />;
}

export namespace TabsTab {
    export type Props = TabsHeadless.Tab.Props;
}
