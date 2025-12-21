import React from 'react';

import { Marquee as MarqueeHeadless } from '@flippo-ui/headless-components/marquee';
import { cx } from 'class-variance-authority';

import styles from './MarqueeTrack.module.scss';

export function MarqueeTrack(props: MarqueeTrack.Props) {
    const { className, ...otherProps } = props;

    return <MarqueeHeadless.Track {...otherProps} className={cx(styles.MarqueeTrack, className)} />;
}

export namespace MarqueeTrack {
    export type Props = MarqueeHeadless.Track.Props;
}
