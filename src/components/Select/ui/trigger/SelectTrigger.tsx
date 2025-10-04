import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectTrigger.module.scss';

export function SelectTrigger(props: SelectTrigger.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Trigger {...otherProps} className={cx(styles.SelectTrigger, className)} />;
}

export namespace SelectTrigger {
    export type Props = SelectHeadless.Trigger.Props;
}
