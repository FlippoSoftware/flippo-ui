import React from 'react';

import { QrCode as QrCodeHeadless } from '@flippo-ui/headless-components/qr-code';
import { cx } from 'class-variance-authority';

import styles from './QrCodeOverlay.module.scss';

export function QrCodeOverlay(props: QrCodeOverlay.Props) {
    const { className, ...otherProps } = props;

    return <QrCodeHeadless.Overlay {...otherProps} className={cx(styles.QrCodeOverlay, className)} />;
}

export namespace QrCodeOverlay {
    export type Props = QrCodeHeadless.Overlay.Props;
}
