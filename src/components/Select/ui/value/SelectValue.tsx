import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectValue.module.scss';

export function SelectValue(props: SelectValue.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Value {...otherProps} className={cx(styles.SelectValue, className)} />;
}

export namespace SelectValue {
    export type Props = SelectHeadless.Value.Props;
}
