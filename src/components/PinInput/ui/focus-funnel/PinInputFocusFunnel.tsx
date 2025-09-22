import React from 'react';

import { PinInput as PinInputHeadless } from '@flippo-ui/headless-components/pin-input';
import { cx } from 'class-variance-authority';

import styles from './PinInputFocusFunnel.module.scss';

export function PinInputFocusFunnel(props: PinInputFocusFunnel.Props) {
    const {
        className,
        ...rest
    } = props;

    return <PinInputHeadless.FocusFunnel {...rest} className={cx(styles.PinInputFocusFunnel, className)} />;
}

export namespace PinInputFocusFunnel {
    export type Props = PinInputHeadless.FocusFunnel.Props;
}
