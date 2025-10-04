import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectScrollUpArrow.module.scss';

export function SelectScrollUpArrow(props: SelectScrollUpArrow.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.ScrollUpArrow {...otherProps} className={cx(styles.SelectScrollUpArrow, className)} />;
}

export namespace SelectScrollUpArrow {
    export type Props = SelectHeadless.ScrollUpArrow.Props;
}
