import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';
import { cx } from 'class-variance-authority';

import styles from './FieldRoot.module.scss';

export function FieldRoot(props: FieldRoot.Props) {
    const { className, ...otherProps } = props;

    return <FieldHeadless.Root {...otherProps} className={cx(styles.FieldRoot, className)} />;
}

export namespace FieldRoot {
    export type Props = FieldHeadless.Root.Props;
}
