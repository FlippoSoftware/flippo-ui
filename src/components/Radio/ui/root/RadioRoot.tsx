import React from 'react';

import { Radio as RadioHeadless } from '@flippo-ui/headless-components/radio';
import { cx } from 'class-variance-authority';

import styles from './RadioRoot.module.scss';

export function RadioRoot(props: RadioRoot.Props) {
    const { className, ...otherProps } = props;

    return <RadioHeadless.Root {...otherProps} className={cx(styles.RadioRoot, className)} />;
}

export namespace RadioRoot {
    export type Props = RadioHeadless.Root.Props;
}
