import React from 'react';

import { ToggleGroup as ToggleGroupHeadless } from '@flippo-ui/headless-components/toggle-group';
import { cx } from 'class-variance-authority';

import styles from './ToggleGroup.module.scss';

export function ToggleGroup(props: ToggleGroup.Props) {
    const {
        className,
        ...rest
    } = props;

    return <ToggleGroupHeadless {...rest} className={cx(styles.ToggleGroup, className)} />;
}

export namespace ToggleGroup {
    export type Props = ToggleGroupHeadless.Props;
}
