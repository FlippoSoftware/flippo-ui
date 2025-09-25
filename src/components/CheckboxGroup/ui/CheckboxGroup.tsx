import React from 'react';

import { CheckboxGroup as CheckboxGroupHeadless } from '@flippo-ui/headless-components/checkbox-group';
import { cx } from 'class-variance-authority';

import styles from './CheckboxGroup.module.scss';

export function CheckboxGroup(props: CheckboxGroup.Props) {
    const {
        className,
        ...otherProps
    } = props;

    return <CheckboxGroupHeadless {...otherProps} className={cx(styles.CheckboxGroup, className)} />;
}

export namespace CheckboxGroup {
    export type Props = CheckboxGroupHeadless.Props;
}
