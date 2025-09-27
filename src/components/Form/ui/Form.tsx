import React from 'react';

import { Form as FormHeadless } from '@flippo-ui/headless-components/form';
import { cx } from 'class-variance-authority';

import styles from './Form.module.scss';

export function Form(props: Form.Props) {
    const { className, ...otherProps } = props;

    return <FormHeadless {...otherProps} className={cx(styles.Form, className)} />;
}

export namespace Form {
    export type Props = FormHeadless.Props;
}
