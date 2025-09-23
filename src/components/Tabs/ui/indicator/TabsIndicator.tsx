import React from 'react';

import { Tabs as TabsHeadless } from '@flippo-ui/headless-components/tabs';
import { cx } from 'class-variance-authority';

import styles from './TabsIndicator.module.scss';

export function TabsIndicator(props: TabsIndicator.Props) {
    const { className, ...otherProps } = props;

    return <TabsHeadless.Indicator {...otherProps} className={cx(styles.TabsIndicator, className)} />;
}

export namespace TabsIndicator {
    export type Props = TabsHeadless.Indicator.Props;
}
