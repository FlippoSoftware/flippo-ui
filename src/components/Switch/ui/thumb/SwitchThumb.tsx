import React from 'react';

import { Switch as SwitchHeadless } from '@flippo-ui/headless-components/switch';
import { cva } from 'class-variance-authority';

import styles from './SwitchThumb.module.scss';

const SwitchThumbVariants = cva(styles.SwitchThumb);

export function SwitchThumb(props: SwitchThumb.Props) {
    const { className, ...rest } = props;

    const thumbClasses = SwitchThumbVariants({ className });

    return <SwitchHeadless.Thumb {...rest} className={thumbClasses} />;
}

export namespace SwitchThumb {
    export type Props = SwitchHeadless.Thumb.Props;
}
