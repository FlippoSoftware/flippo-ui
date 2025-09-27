import React from 'react';

import { Fieldset as FieldsetHeadless } from '@flippo-ui/headless-components/fieldset';
import { cx } from 'class-variance-authority';

import styles from './FieldsetRoot.module.scss';

export function FieldsetRoot(props: FieldsetRoot.Props) {
    const { className, ...otherProps } = props;

    return <FieldsetHeadless.Root {...otherProps} className={cx(styles.Fieldset, className)} />;
}

export namespace FieldsetRoot {
    export type Props = FieldsetHeadless.Root.Props;
}
