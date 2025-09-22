import React from 'react';

import { PinInput as PinInputHeadless } from '@flippo-ui/headless-components/pin-input';
import { cx } from 'class-variance-authority';

import styles from './PinInputRoot.module.scss';

export function PinInputRoot(props: PinInputRoot.Props) {
    const {
        className,
        ...rest
    } = props;

    return <PinInputHeadless.Root {...rest} className={cx(styles.PinInputRoot, className)} />;
}

export namespace PinInputRoot {
    export type Props = PinInputHeadless.Root.Props;
}
