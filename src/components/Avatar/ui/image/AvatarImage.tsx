import React from 'react';

import { Avatar as AvatarHeadless } from '@flippo-ui/headless-components/avatar';
import { cx } from 'class-variance-authority';

import styles from './AvatarImage.module.scss';

export function AvatarImage(props: AvatarImage.Props) {
    const { className, ...otherProps } = props;

    return <AvatarHeadless.Image {...otherProps} className={cx(styles.AvatarImage, className)} />;
}

export namespace AvatarImage {
    export type Props = AvatarHeadless.Image.Props;
}
