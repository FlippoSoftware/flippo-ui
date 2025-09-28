import React from 'react';

import { Collapsible as CollapsibleHeadless } from '@flippo-ui/headless-components/collapsible';
import { cx } from 'class-variance-authority';

import styles from './CollapsibleRoot.module.scss';

export function CollapsibleRoot(props: CollapsibleRoot.Props) {
    const { className, ...otherProps } = props;

    return <CollapsibleHeadless.Root {...otherProps} className={cx(styles.CollapsibleRoot, className)} />;
}

export namespace CollapsibleRoot {
    export type Props = CollapsibleHeadless.Root.Props;
}
