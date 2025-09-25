import React from 'react';

import { Checkbox as CheckboxHeadless } from '@flippo-ui/headless-components/checkbox';
import { cx } from 'class-variance-authority';

import styles from './CheckboxRoot.module.scss';

export function CheckboxRoot(props: CheckboxRoot.Props) {
    const { className, ...otherProps } = props;

    return <CheckboxHeadless.Root {...otherProps} className={cx(styles.CheckboxRoot, className)} />;
}

export namespace CheckboxRoot {
    export type Props = CheckboxHeadless.Root.Props;
}
