import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectGroup.module.scss';

export function SelectGroup(props: SelectGroup.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Group {...otherProps} className={cx(styles.SelectGroup, className)} />;
}

export namespace SelectGroup {
    export type Props = SelectHeadless.Group.Props;
}
