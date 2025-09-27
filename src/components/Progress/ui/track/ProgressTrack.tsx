import React from 'react';

import { Progress as ProgressHeadless } from '@flippo-ui/headless-components/progress';
import { cva } from 'class-variance-authority';

import styles from './ProgressTrack.module.scss';

const ProgressTrackVariants = cva(styles.ProgressTrack);

export function ProgressTrack(props: ProgressTrack.Props) {
    const { className, ...rest } = props;

    const trackClasses = ProgressTrackVariants({ className });

    return <ProgressHeadless.Track {...rest} className={trackClasses} />;
}

export namespace ProgressTrack {
    export type Props = ProgressHeadless.Track.Props;
}
