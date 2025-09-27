import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';
import { cx } from 'class-variance-authority';

import styles from './FieldError.module.scss';

export function FieldError(props: FieldError.Props) {
    const { className, ...otherProps } = props;

    return <FieldHeadless.Error {...otherProps} className={cx(styles.FieldError, className)} />;
}

export namespace FieldError {
    export type Props = FieldHeadless.Error.Props;
}
