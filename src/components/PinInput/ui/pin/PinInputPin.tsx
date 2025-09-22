import React from 'react';

import { PinInput as PinInputHeadless } from '@flippo-ui/headless-components/pin-input';
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './PinInputPin.module.scss';

const PinInputPinVariants = cva(styles.PinInputPin, {
    variants: {
        variant: {
            inverted: styles.PinInputPin_inverted,
            light: styles.PinInputPin_light
        },
        corners: {
            'clear': styles['corners-clear-clear'],
            'circle': styles['corners-circle-circle'],
            'round': styles['corners-round-round'],
            'round-clear': styles['corners-round-clear'],
            'clear-round': styles['corners-clear-round'],
            'round-circle': styles['corners-round-circle'],
            'clear-circle': styles['corners-clear-circle']
        }
    },
    defaultVariants: {
        variant: 'inverted',
        corners: 'round'
    }
});

export function PinInputPin(props: PinInputPin.Props) {
    const {
        className,
        variant = 'inverted',
        corners = 'round',
        ...rest
    } = props;

    const pinInputPinClasses = PinInputPinVariants({ variant, corners, className });

    return <PinInputHeadless.Pin {...rest} className={pinInputPinClasses} />;
}

export namespace PinInputPin {
    export type Props = PinInputHeadless.Pin.Props & VariantProps<typeof PinInputPinVariants>;
}
