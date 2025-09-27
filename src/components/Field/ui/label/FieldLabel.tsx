import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';
import { cx } from 'class-variance-authority';

import styles from './FieldLabel.module.scss';

export function FieldLabel(props: FieldLabel.Props) {
    const { className, ...otherProps } = props;

    return <FieldHeadless.Label {...otherProps} className={cx(styles.FieldLabel, className)} />;
}

export namespace FieldLabel {
    export type Props = FieldHeadless.Label.Props;
}
