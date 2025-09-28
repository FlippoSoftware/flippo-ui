import React from 'react';

import { NumberField as NumberFieldHeadless } from '@flippo-ui/headless-components/number-field';
import { cx } from 'class-variance-authority';

import styles from './NumberFieldGroup.module.scss';

export function NumberFieldGroup(props: NumberFieldGroup.Props) {
    const { className, ...otherProps } = props;

    return <NumberFieldHeadless.Group {...otherProps} className={cx(styles.NumberFieldGroup, className)} />;
}

export namespace NumberFieldGroup {
    export type Props = NumberFieldHeadless.Group.Props;
}
