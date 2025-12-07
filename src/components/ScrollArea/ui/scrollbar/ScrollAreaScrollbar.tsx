import React from 'react';

import { ScrollArea as ScrollAreaHeadless } from '@flippo-ui/headless-components/scroll-area';
import { cx } from 'class-variance-authority';

import styles from './ScrollAreaScrollbar.module.scss';

export function ScrollAreaScrollbar(props: ScrollAreaScrollbar.Props) {
    const { className, ...otherProps } = props;

    return <ScrollAreaHeadless.Scrollbar {...otherProps} className={cx(styles.ScrollAreaScrollbar, className)} />;
}

export namespace ScrollAreaScrollbar {
    export type Props = ScrollAreaHeadless.Scrollbar.Props;
}


