import React from 'react';

import { Slider as SliderHeadless } from '@flippo-ui/headless-components/slider';
import { cva } from 'class-variance-authority';

import styles from './SliderControl.module.scss';

const SliderControlVariants = cva(styles.SliderControl);

export function SliderControl(props: SliderControl.Props) {
    const { className, ...rest } = props;

    const controlClasses = SliderControlVariants({ className });

    return <SliderHeadless.Control {...rest} className={controlClasses} />;
}

export namespace SliderControl {
    export type Props = SliderHeadless.Control.Props;
}
