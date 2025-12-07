import React from 'react';

import { ScrollArea as ScrollAreaHeadless } from '@flippo-ui/headless-components/scroll-area';
import { cx } from 'class-variance-authority';

import styles from './ScrollAreaRoot.module.scss';

export function ScrollAreaRoot(props: ScrollAreaRoot.Props) {
    const { className, ...otherProps } = props;

    return <ScrollAreaHeadless.Root {...otherProps} className={cx(styles.ScrollAreaRoot, className)} />;
}

export namespace ScrollAreaRoot {
    export type Props = ScrollAreaHeadless.Root.Props;
}
