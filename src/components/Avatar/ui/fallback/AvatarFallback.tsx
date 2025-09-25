import React from 'react';

import { Avatar as AvatarHeadless } from '@flippo-ui/headless-components/avatar';
import { cx } from 'class-variance-authority';

import styles from './AvatarFallback.module.scss';

export function AvatarFallback(props: AvatarFallback.Props) {
    const { className, ...otherProps } = props;

    return <AvatarHeadless.Fallback {...otherProps} className={cx(styles.AvatarFallback, className)} />;
}

export namespace AvatarFallback {
    export type Props = AvatarHeadless.Fallback.Props;
}
