import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';
import { cva } from 'class-variance-authority';

import styles from './FieldDescription.module.scss';

const FieldDescriptionVariants = cva(styles.FieldDescription);

export function FieldDescription(props: FieldDescription.Props) {
    const { className, ...rest } = props;

    const descriptionClasses = FieldDescriptionVariants({ className });

    return <FieldHeadless.Description {...rest} className={descriptionClasses} />;
}

export namespace FieldDescription {
    export type Props = FieldHeadless.Description.Props;
}
