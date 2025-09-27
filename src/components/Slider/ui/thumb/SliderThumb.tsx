import React from 'react';

import { Slider as SliderHeadless } from '@flippo-ui/headless-components/slider';
import { cx } from 'class-variance-authority';

import styles from './SliderThumb.module.scss';

export function SliderThumb(props: SliderThumb.Props) {
    const { className, ...otherProps } = props;

    return <SliderHeadless.Thumb {...otherProps} className={cx(styles.SliderThumb, className)} />;
}

export namespace SliderThumb {
    export type Props = SliderHeadless.Thumb.Props;
}
