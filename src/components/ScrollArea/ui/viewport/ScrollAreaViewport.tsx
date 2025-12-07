import React from 'react';

import { ScrollArea as ScrollAreaHeadless } from '@flippo-ui/headless-components/scroll-area';
import { cx } from 'class-variance-authority';

import styles from './ScrollAreaViewport.module.scss';

export function ScrollAreaViewport(props: ScrollAreaViewport.Props) {
    const { className, ...otherProps } = props;

    return <ScrollAreaHeadless.Viewport {...otherProps} className={cx(styles.ScrollAreaViewport, className)} />;
}

export namespace ScrollAreaViewport {
    export type Props = ScrollAreaHeadless.Viewport.Props;
}
