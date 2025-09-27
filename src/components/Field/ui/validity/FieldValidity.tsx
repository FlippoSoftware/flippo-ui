import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';
import { cva } from 'class-variance-authority';

import styles from './FieldValidity.module.scss';

const FieldValidityVariants = cva(styles.FieldValidity);

export function FieldValidity(props: FieldValidity.Props) {
    const { className, ...rest } = props;

    const validityClasses = FieldValidityVariants({ className });

    return <FieldHeadless.Validity {...rest} className={validityClasses} />;
}

export namespace FieldValidity {
    export type Props = FieldHeadless.Validity.Props;
}
