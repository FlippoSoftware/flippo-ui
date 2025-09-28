import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldRoot.module.scss';

export function NumberFieldRoot(props: NumberFieldRoot.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.Root {...otherProps} className={cx(styles.NumberFieldRoot, className)} />;
}

export namespace NumberFieldRoot {
    export type Props = NumberFieldHeadless.Root.Props;
}
