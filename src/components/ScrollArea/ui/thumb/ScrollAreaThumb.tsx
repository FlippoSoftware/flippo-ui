import React from 'react';

import { ScrollArea as ScrollAreaHeadless } from '@flippo-ui/headless-components/scroll-area';
import { cx } from 'class-variance-authority';

import styles from './ScrollAreaThumb.module.scss';

export function ScrollAreaThumb(props: ScrollAreaThumb.Props) {
    const { className, ...otherProps } = props;

    return <ScrollAreaHeadless.Thumb {...otherProps} className={cx(styles.ScrollAreaThumb, className)} />;
}

export namespace ScrollAreaThumb {
    export type Props = ScrollAreaHeadless.Thumb.Props;
}


