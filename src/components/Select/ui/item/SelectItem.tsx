import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectItem.module.scss';

export function SelectItem(props: SelectItem.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Item {...otherProps} className={cx(styles.SelectItem, className)} />;
}

export namespace SelectItem {
    export type Props = SelectHeadless.Item.Props;
}
