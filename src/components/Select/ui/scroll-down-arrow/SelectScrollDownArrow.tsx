import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectScrollDownArrow.module.scss';

export function SelectScrollDownArrow(props: SelectScrollDownArrow.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.ScrollDownArrow {...otherProps} className={cx(styles.SelectScrollDownArrow, className)} />;
}

export namespace SelectScrollDownArrow {
    export type Props = SelectHeadless.ScrollDownArrow.Props;
}
