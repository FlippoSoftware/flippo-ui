import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldInput.module.scss';

export function NumberFieldInput(props: NumberFieldInput.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.Input {...otherProps} className={cx(styles.NumberFieldInput, className)} />;
}

export namespace NumberFieldInput {
    export type Props = NumberFieldHeadless.Input.Props;
}
