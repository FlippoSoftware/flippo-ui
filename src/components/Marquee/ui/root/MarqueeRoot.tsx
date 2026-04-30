import React from 'react';

import { Marquee as MarqueeHeadless } from '@flippo-ui/headless-components/marquee';
import { cx } from 'class-variance-authority';

import styles from './MarqueeRoot.module.scss';

export function MarqueeRoot(props: MarqueeRoot.Props) {
    const { className, ...otherProps } = props;

    return <MarqueeHeadless.Root {...otherProps} className={cx(styles.MarqueeRoot, className)} />;
}

export namespace MarqueeRoot {
    export type Props = MarqueeHeadless.Root.Props;
}
