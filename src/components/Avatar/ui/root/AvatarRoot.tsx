import React from 'react';

import { Avatar as AvatarHeadless } from '@flippo-ui/headless-components/avatar';
import { cx } from 'class-variance-authority';

import styles from './AvatarRoot.module.scss';

export function AvatarRoot(props: AvatarRoot.Props) {
    const { className, ...otherProps } = props;

    return <AvatarHeadless.Root {...otherProps} className={cx(styles.AvatarRoot, className)} />;
}

export namespace AvatarRoot {
    export type Props = AvatarHeadless.Root.Props;
}
