import React from 'react';

import { QrCode as QrCodeHeadless } from '@flippo-ui/headless-components/qr-code';
import { cx } from 'class-variance-authority';

import styles from './QrCodeRoot.module.scss';

export function QrCodeRoot(props: QrCodeRoot.Props) {
    const {
        className,
        size = 200,
        options,
        ...otherProps
    } = props;

    return (
        <QrCodeHeadless.Root
            {...otherProps}
            size={size}
            options={{
                type: 'svg',
                ...options,
                dotsOptions: {
                    color: 'var(--f-color-text-2)',
                    type: 'extra-rounded',
                    ...options?.dotsOptions
                },
                backgroundOptions: {
                    color: 'transparent',
                    ...options?.backgroundOptions
                },
                cornersSquareOptions: {
                    color: 'var(--f-color-text-2)',
                    type: 'extra-rounded',
                    ...options?.cornersSquareOptions
                },
                cornersDotOptions: {
                    color: 'var(--f-color-text-2)',
                    type: 'extra-rounded',
                    ...options?.cornersDotOptions
                }
            }}
            className={cx(styles.QrCodeRoot, className)}
        />
    );
}

export namespace QrCodeRoot {
    export type Props = QrCodeHeadless.Root.Props;
}
