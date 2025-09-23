import React from 'react';

import { Tabs as TabsHeadless } from '@flippo-ui/headless-components/tabs';
import { cx } from 'class-variance-authority';

import styles from './TabsList.module.scss';

export function TabsList(props: TabsList.Props) {
    const { className, ...otherProps } = props;

    return <TabsHeadless.List {...otherProps} className={cx(styles.TabsList, className)} />;
}

export namespace TabsList {
    export type Props = TabsHeadless.List.Props;
}
