import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';
import { cva } from 'class-variance-authority';

import styles from './SelectGroupLabel.module.scss';

const SelectGroupLabelVariants = cva(styles.SelectGroupLabel);

export function SelectGroupLabel(props: SelectGroupLabel.Props) {
    const { className, ...rest } = props;

    const labelClasses = SelectGroupLabelVariants({ className });

    return <SelectHeadless.GroupLabel {...rest} className={labelClasses} />;
}

export namespace SelectGroupLabel {
    export type Props = SelectHeadless.GroupLabel.Props;
}
