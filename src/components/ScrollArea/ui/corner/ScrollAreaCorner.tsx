import React from 'react';

import { ScrollArea as ScrollAreaHeadless } from '@flippo-ui/headless-components/scroll-area';
import { cx } from 'class-variance-authority';

import styles from './ScrollAreaCorner.module.scss';

export function ScrollAreaCorner(props: ScrollAreaCorner.Props) {
    const { className, ...otherProps } = props;

    return <ScrollAreaHeadless.Corner {...otherProps} className={cx(styles.ScrollAreaCorner, className)} />;
}

export namespace ScrollAreaCorner {
    export type Props = ScrollAreaHeadless.Corner.Props;
}


