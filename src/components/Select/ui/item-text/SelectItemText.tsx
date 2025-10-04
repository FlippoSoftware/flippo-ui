import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectItemText.module.scss';

export function SelectItemText(props: SelectItemText.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.ItemText {...otherProps} className={cx(styles.SelectItemText, className)} />;
}

export namespace SelectItemText {
    export type Props = SelectHeadless.ItemText.Props;
}
