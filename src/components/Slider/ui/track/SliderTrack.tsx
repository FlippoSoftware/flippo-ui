import React from 'react';

import { Slider as SliderHeadless } from '@flippo-ui/headless-components/slider';
import { cva } from 'class-variance-authority';

import styles from './SliderTrack.module.scss';

const SliderTrackVariants = cva(styles.SliderTrack);

export function SliderTrack(props: SliderTrack.Props) {
    const { className, ...rest } = props;

    const trackClasses = SliderTrackVariants({ className });

    return <SliderHeadless.Track {...rest} className={trackClasses} />;
}

export namespace SliderTrack {
    export type Props = SliderHeadless.Track.Props;
}
