import React from 'react';

import { Toolbar as ToolbarHeadless } from '@flippo-ui/headless-components/toolbar';
import { cx } from 'class-variance-authority';

import styles from './ToolbarInput.module.scss';

export function ToolbarInput(props: ToolbarInput.Props) {
    const { className, ...otherProps } = props;

    return <ToolbarHeadless.Input {...otherProps} className={cx(styles.ToolbarInput, className)} />;
}

export namespace ToolbarInput {
    export type Props = ToolbarHeadless.Input.Props;
}
