import React from 'react';

import { ScrollArea as ScrollAreaHeadless } from '@flippo-ui/headless-components/scroll-area';
import { cx } from 'class-variance-authority';

import styles from './ScrollAreaContent.module.scss';

export function ScrollAreaContent(props: ScrollAreaContent.Props) {
    const { className, ...otherProps } = props;

    return <ScrollAreaHeadless.Content {...otherProps} className={cx(styles.ScrollAreaContent, className)} />;
}

export namespace ScrollAreaContent {
    export type Props = ScrollAreaHeadless.Content.Props;
}


