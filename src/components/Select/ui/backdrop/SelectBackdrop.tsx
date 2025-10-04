import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectBackdrop.module.scss';

export function SelectBackdrop(props: SelectBackdrop.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Backdrop {...otherProps} className={cx(styles.SelectBackdrop, className)} />;
}

export namespace SelectBackdrop {
    export type Props = SelectHeadless.Backdrop.Props;
}
