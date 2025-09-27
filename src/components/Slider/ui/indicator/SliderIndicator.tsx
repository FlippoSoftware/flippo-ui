import React from 'react';

import { Slider as SliderHeadless } from '@flippo-ui/headless-components/slider';
import { cx } from 'class-variance-authority';

import styles from './SliderIndicator.module.scss';

export function SliderIndicator(props: SliderIndicator.Props) {
    const { className, ...otherProps } = props;

    return <SliderHeadless.Indicator {...otherProps} className={cx(styles.SliderIndicator, className)} />;
}

export namespace SliderIndicator {
    export type Props = SliderHeadless.Indicator.Props;
}
