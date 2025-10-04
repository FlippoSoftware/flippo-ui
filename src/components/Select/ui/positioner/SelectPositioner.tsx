import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cx } from 'class-variance-authority';

import styles from './SelectPositioner.module.scss';

export function SelectPositioner(props: SelectPositioner.Props) {
    const { className, ...otherProps } = props;

    return <SelectHeadless.Positioner {...otherProps} className={cx(styles.SelectPositioner, className)} />;
}

export namespace SelectPositioner {
    export type Props = SelectHeadless.Positioner.Props;
}
