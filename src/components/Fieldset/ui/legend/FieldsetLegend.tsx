import React from 'react';

import { Fieldset as FieldsetHeadless } from '@flippo-ui/headless-components/fieldset';
import { cx } from 'class-variance-authority';

import styles from './FieldsetLegend.module.scss';

export function FieldsetLegend(props: FieldsetLegend.Props) {
    const { className, ...otherProps } = props;

    return <FieldsetHeadless.Legend {...otherProps} className={cx(styles.FieldsetLegend, className)} />;
}

export namespace FieldsetLegend {
    export type Props = FieldsetHeadless.Legend.Props;
}
